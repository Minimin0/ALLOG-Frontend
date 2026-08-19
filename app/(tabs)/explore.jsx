import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import CoachMascotButton from '@/components/common/CoachMascotButton';
import Icon from '@/components/common/Icon';
import AnimatedEntrance from '../../mobile/src/components/AnimatedEntrance';
import { getCoachImage } from '../../mobile/src/utils/coach';
import { ApiError } from '@/services/api';
import { fetchPublicGroups, fetchRoutineCatalog, joinGroup } from '@/services/groupApi';
import { useUserStore } from '@/stores/userStore';

// 탐색 화면. 목록은 GET /api/v1/groups가 authority다 —
// PUBLIC + RECRUITING 필터링은 백엔드가 하므로 여기서 다시 하지 않는다.
// 카테고리/기간은 받아온 목록을 좁혀 보여주기 위한 표시용 필터일 뿐이다.
// 화면 디자인은 팀원 최신본(mobile/src/screens/main/ExploreScreen.js) 이식 —
// 도너의 mock 그룹 목록은 가져오지 않고 백엔드 목록만 그린다.
const categories = [
  { label: '전체', key: null },
  { label: '수분케어', key: 'HYDRATION' },
  { label: '식사', key: 'MEAL' },
  { label: '운동', key: 'EXERCISE' },
  { label: '수면', key: 'SLEEP' },
];
const durations = ['전체', '7일', '14일', '30일'];

function durationDays(schedule) {
  if (!schedule?.startDate || !schedule?.endDate) return null;
  const start = new Date(schedule.startDate);
  const end = new Date(schedule.endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  return Math.round((end - start) / 86400000) + 1;
}

const COACH_LABEL = { supportive: '응원형', pressuring: '압박형', fact_based: '팩트형', humorous: '유머형' };

export default function ExploreScreen() {
  const router = useRouter();
  const coachStyle = useUserStore((s) => s.profile?.onboarding?.coachStyle);
  const [items, setItems] = useState([]);
  const [routineKeys, setRoutineKeys] = useState({}); // routineDefinitionId -> routineKey
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [category, setCategory] = useState('전체');
  const [query, setQuery] = useState('');
  const [joinTarget, setJoinTarget] = useState(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [durationFilter, setDurationFilter] = useState('전체');
  const [appliedDuration, setAppliedDuration] = useState('전체');

  const load = useCallback(async () => {
    const [groups, catalog] = await Promise.all([fetchPublicGroups(), fetchRoutineCatalog()]);
    setItems(groups.ok ? groups.data?.items ?? [] : []);
    setLoadError(groups.ok ? null : groups.errorCode);
    if (catalog.ok) {
      setRoutineKeys(
        Object.fromEntries((catalog.data?.items ?? []).map((r) => [r.routineDefinitionId, r.routineKey])),
      );
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const hasActiveFilter = appliedDuration !== '전체';
  const selectedKey = categories.find((c) => c.label === category)?.key ?? null;

  const filteredGroups = useMemo(
    () =>
      items.filter((g) => {
        if (selectedKey && routineKeys[g.routine?.routineDefinitionId] !== selectedKey) return false;
        if (appliedDuration !== '전체' && `${durationDays(g.schedule)}일` !== appliedDuration) return false;
        if (query.trim() && !`${g.name} ${g.routine?.name ?? ''}`.includes(query.trim())) return false;
        return true;
      }),
    [items, selectedKey, routineKeys, appliedDuration, query],
  );

  // "마감 임박" = 남은 자리가 가장 적은 그룹. 추천 API는 아직 없으므로 실제 값으로만 뽑는다.
  const almostFull = useMemo(() => {
    const open = filteredGroups.filter((g) => g.currentMembers < g.maxMembers);
    if (open.length === 0) return null;
    return open.reduce((best, g) =>
      g.maxMembers - g.currentMembers < best.maxMembers - best.currentMembers ? g : best,
    );
  }, [filteredGroups]);

  const confirmJoin = async () => {
    if (!joinTarget || joining) return;
    setJoining(true);
    setJoinError('');

    const response = await joinGroup(joinTarget.groupId);
    setJoining(false);

    if (response.ok) {
      const joined = joinTarget;
      setJoinTarget(null);
      // 하트 차감은 백엔드가 했다. 프론트는 낙관적으로 줄이지 않고 다시 읽는다.
      await useUserStore.getState().loadStats();
      router.push({
        pathname: '/group/join-complete',
        params: { groupId: String(joined.groupId), title: joined.name },
      });
      return;
    }

    if (response.errorCode === ApiError.INSUFFICIENT_HEARTS) {
      setJoinError('하트가 부족해요. 하트를 먼저 얻어주세요.');
    } else if (response.errorCode === ApiError.CONFLICT) {
      // 본문 없는 409는 설계상 모호하다 — 이미 참가/정원 초과/비공개 중 하나다. 목록을 다시 읽는다.
      setJoinError('지금은 참가할 수 없는 그룹이에요. 목록을 새로 고칠게요.');
      load();
    } else if (response.errorCode === ApiError.NOT_FOUND) {
      setJoinError('사라진 그룹이에요.');
      load();
    } else if (response.errorCode === ApiError.NETWORK) {
      setJoinError('서버에 연결할 수 없어요.');
    } else {
      setJoinError('참가에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  };


  const remaining = almostFull ? almostFull.maxMembers - almostFull.currentMembers : 0;

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text className="text-[28px] font-black text-ink">탐색</Text>
        <CoachMascotButton to="/ai" />
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {/* 검색 + 필터 */}
        <View style={s.searchRow}>
          <View style={s.search}>
            <Icon name="search" size={16} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="그룹 또는 루틴 검색..."
              placeholderTextColor="#6b7268"
              style={s.searchInput}
            />
          </View>
          <Pressable
            style={s.filter}
            onPress={() => {
              setDurationFilter(appliedDuration);
              setFilterOpen(true);
            }}
          >
            <Icon name="filter" size={18} />
            {hasActiveFilter ? <View style={s.dot} /> : null}
          </Pressable>
        </View>

        {/* 카테고리 칩 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.categories}>
          {categories.map((item) => {
            const active = category === item.label;
            return (
              <Pressable key={item.label} onPress={() => setCategory(item.label)} style={[s.chip, active && s.chipOn]}>
                <Text style={[s.chipText, active && s.chipTextOn]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 마감 임박 — 추천 API는 아직 없어서 실제 목록에서 남은 자리가 가장 적은 그룹을 쓴다 */}
        {almostFull ? (
          <AnimatedEntrance style={s.ai}>
            <Pressable style={{ flex: 1 }} onPress={() => router.push(`/explore/group/${almostFull.groupId}`)}>
              <Text style={s.aiHint}>
                <Text style={{ fontWeight: '700', color: '#000' }}>마감 임박 </Text>
                자리 {remaining}개 남았어요
              </Text>
              <Text style={s.aiTitle}>{almostFull.name}</Text>
              <Text style={s.meta}>
                {almostFull.currentMembers}/{almostFull.maxMembers}명 <Text style={s.heart}>♥</Text> 1개{' '}
                <Text style={{ fontWeight: '700' }}>모집중</Text>
              </Text>
            </Pressable>
            <Pressable
              style={s.join}
              onPress={() => {
                setJoinError('');
                setJoinTarget(almostFull);
              }}
            >
              <Text style={s.joinText}>참가</Text>
            </Pressable>
          </AnimatedEntrance>
        ) : null}

        {/* 모집중인 그룹 */}
        <Text style={s.section}>모집중인 그룹</Text>
        {loading ? (
          <View style={[s.empty, { paddingVertical: 24 }]}>
            <ActivityIndicator color="#14453a" />
          </View>
        ) : loadError ? (
          <Pressable style={s.empty} onPress={load}>
            <Text style={s.emptyText}>
              {loadError === ApiError.NETWORK
                ? '서버에 연결할 수 없어요.'
                : loadError === ApiError.UNAUTHORIZED
                  ? '로그인이 만료됐어요. 다시 로그인해주세요.'
                  : '목록을 불러오지 못했어요.'}
            </Text>
            <Text style={s.retryText}>다시 시도</Text>
          </Pressable>
        ) : filteredGroups.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyText}>조건에 맞는 그룹이 없어요.</Text>
          </View>
        ) : (
          filteredGroups.map((group, index) => {
            const full = group.currentMembers >= group.maxMembers;
            return (
              <AnimatedEntrance key={group.groupId} delay={index * 70} style={s.group}>
                <Pressable style={{ flex: 1 }} onPress={() => router.push(`/explore/group/${group.groupId}`)}>
                  <Text style={[s.groupTitle, full && s.muted]}>{group.name}</Text>
                  <Text style={[s.groupMeta, full && s.muted]}>
                    {group.currentMembers}/{group.maxMembers}명 <Text style={full ? null : s.heart}>♥</Text> 1개 필요
                  </Text>
                </Pressable>
                <Pressable
                  disabled={full}
                  style={[s.groupButton, full && s.full]}
                  onPress={() => {
                    setJoinError('');
                    setJoinTarget(group);
                  }}
                >
                  <Text style={[s.groupButtonText, full && { color: '#d9573b' }]}>{full ? '마감' : '참가'}</Text>
                </Pressable>
              </AnimatedEntrance>
            );
          })
        )}

        {/* 직접 만들기 */}
        <Text style={s.question}>하고싶은 루틴이 없다면?</Text>
        <Pressable style={s.create} onPress={() => router.push('/group/create')}>
          <Text style={s.createText}>직접 그룹 만들기</Text>
        </Pressable>
        <Text style={s.code} onPress={() => router.push('/group/join')}>
          이미 초대 코드가 있나요? 코드로 참여하기
        </Text>
      </ScrollView>

      {/* 참가 모달 */}
      <Modal
        visible={!!joinTarget}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => !joining && setJoinTarget(null)}
      >
        <View style={s.modalRoot}>
          <Pressable style={s.dim} onPress={() => !joining && setJoinTarget(null)} />
          <AnimatedEntrance style={s.dialog} distance={10} duration={240}>
            <View style={s.dialogTop}>
              <View style={s.coachBadge}>
                <Image source={getCoachImage(COACH_LABEL[coachStyle])} style={s.dialogCoach} resizeMode="contain" />
              </View>
              <Pressable
                accessibilityLabel="참가 창 닫기"
                hitSlop={10}
                style={s.closeButton}
                onPress={() => !joining && setJoinTarget(null)}
              >
                <Text style={s.closeText}>×</Text>
              </Pressable>
            </View>
            <Text style={s.dialogEyebrow}>함께 루틴을 시작해요</Text>
            <Text style={s.dialogTitle}>{joinTarget?.name}</Text>
            <Text style={s.dialogText}>멤버들과 매일 인증하며 목표를 달성해 보세요.</Text>
            <View style={s.joinSummary}>
              <View style={s.summaryItem}>
                <Text style={s.summaryLabel}>참여 인원</Text>
                <Text style={s.summaryValue}>
                  {joinTarget?.currentMembers}/{joinTarget?.maxMembers}명
                </Text>
              </View>
              <View style={s.summaryLine} />
              <View style={s.summaryItem}>
                <Text style={s.summaryLabel}>참가 비용</Text>
                <Text style={[s.summaryValue, s.heartCost]}>♥ 1개</Text>
              </View>
            </View>
            <Text style={s.joinNotice}>참가하면 하트 1개가 사용되며 바로 그룹에 입장해요.</Text>
            {joinError ? <Text style={s.joinErrorText}>{joinError}</Text> : null}
            <View style={s.dialogRow}>
              <Pressable disabled={joining} style={s.cancel} onPress={() => setJoinTarget(null)}>
                <Text style={s.cancelText}>다음에</Text>
              </Pressable>
              <Pressable disabled={joining} style={[s.confirm, joining && { opacity: 0.6 }]} onPress={confirmJoin}>
                {joining ? <ActivityIndicator color="#fff" /> : <Text style={s.confirmText}>참가하기</Text>}
              </Pressable>
            </View>
          </AnimatedEntrance>
        </View>
      </Modal>

      {/* 필터 모달 — 모집 상태는 백엔드가 RECRUITING으로 고정하므로 기간만 남긴다 */}
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={s.dim} onPress={() => setFilterOpen(false)} />
        <View style={s.sheet}>
          <Text style={s.dialogTitle}>필터</Text>
          <Text style={s.section}>기간</Text>
          <View style={s.dialogRow}>
            {durations.map((d) => (
              <Pressable
                key={d}
                style={[s.filterChip, durationFilter === d && s.chipOn]}
                onPress={() => setDurationFilter(d)}
              >
                <Text style={durationFilter === d ? s.chipTextOn : null}>{d}</Text>
              </Pressable>
            ))}
          </View>
          <View style={s.dialogRow}>
            <Pressable style={s.cancel} onPress={() => setDurationFilter('전체')}>
              <Text style={s.cancelText}>초기화</Text>
            </Pressable>
            <Pressable
              style={[s.create, { flex: 2 }]}
              onPress={() => {
                setAppliedDuration(durationFilter);
                setFilterOpen(false);
              }}
            >
              <Text style={s.createText}>적용하기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f6f3' },
  header: {
    paddingHorizontal: 30,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: { paddingHorizontal: 30, paddingTop: 20, paddingBottom: 110, gap: 12 },
  searchRow: { flexDirection: 'row', gap: 8 },
  search: {
    height: 45,
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#6b7268' },
  filter: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: { position: 'absolute', right: 6, top: 6, width: 8, height: 8, borderRadius: 4, backgroundColor: '#d9573b' },
  categories: { gap: 6 },
  chip: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipOn: { borderColor: '#000', backgroundColor: '#000' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6b7268' },
  chipTextOn: { color: '#fff' },
  ai: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#edf2ec',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiHint: { fontSize: 11, color: '#14453a' },
  aiTitle: { marginTop: 8, fontSize: 16, fontWeight: '700' },
  meta: { marginTop: 8, fontSize: 12, fontWeight: '600' },
  heart: { color: '#d9573b' },
  join: { borderRadius: 12, backgroundColor: '#14453a', paddingHorizontal: 14, paddingVertical: 8 },
  joinText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  section: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  group: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTitle: { fontSize: 15, fontWeight: '700', color: '#1f2a24' },
  groupMeta: { marginTop: 6, fontSize: 12, color: '#6b7268' },
  muted: { color: '#bababa' },
  groupButton: { borderRadius: 12, backgroundColor: '#edf2ec', paddingHorizontal: 14, paddingVertical: 8 },
  full: { backgroundColor: '#f9ddd7', opacity: 0.4 },
  groupButtonText: { fontSize: 12, fontWeight: '700', color: '#1f3d2b' },
  empty: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  emptyText: { textAlign: 'center', fontSize: 13, color: '#6b7268' },
  retryText: { marginTop: 4, fontSize: 12, fontWeight: '700', color: '#14453a' },
  question: { marginTop: 8, textAlign: 'center', fontSize: 13, color: '#6b7268' },
  create: { height: 50, borderRadius: 27.5, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  createText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  code: { textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#6b7268', textDecorationLine: 'underline' },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,.4)' },
  modalRoot: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  dialog: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: '#fffdf9',
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  dialogTop: { minHeight: 54, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  coachBadge: {
    width: 54,
    height: 54,
    borderRadius: 19,
    backgroundColor: '#edf2ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogCoach: { width: 48, height: 48 },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f1efe9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { marginTop: -2, fontSize: 24, color: '#6b7268' },
  dialogEyebrow: { marginTop: 16, marginBottom: 7, fontSize: 12, fontWeight: '700', color: '#527065' },
  dialogTitle: { fontSize: 22, lineHeight: 29, fontWeight: '800' },
  dialogText: { marginTop: 8, fontSize: 14, lineHeight: 21, color: '#6b7268' },
  joinSummary: {
    marginTop: 18,
    minHeight: 72,
    borderRadius: 18,
    backgroundColor: '#f5f3ed',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  summaryItem: { flex: 1, alignItems: 'center', gap: 5 },
  summaryLabel: { fontSize: 11, color: '#7c8178' },
  summaryValue: { fontSize: 15, fontWeight: '800', color: '#202420' },
  summaryLine: { width: 1, height: 32, backgroundColor: '#dfddd5' },
  heartCost: { color: '#d9573b' },
  joinNotice: { marginTop: 12, fontSize: 11, lineHeight: 17, textAlign: 'center', color: '#858980' },
  joinErrorText: { marginTop: 8, fontSize: 12, fontWeight: '600', textAlign: 'center', color: '#d9573b' },
  dialogRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  cancel: { flex: 1, height: 52, borderRadius: 17, backgroundColor: '#ebe9e2', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 15, fontWeight: '700', color: '#525851' },
  confirm: {
    flex: 1.35,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#172e28',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
    padding: 24,
    paddingBottom: 35,
  },
  filterChip: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
