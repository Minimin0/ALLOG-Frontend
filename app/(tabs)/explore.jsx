import { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';

import CoachMascotButton from '@/components/common/CoachMascotButton';
import Icon from '@/components/common/Icon';
import { ApiError } from '@/services/api';
import { fetchPublicGroups, fetchRoutineCatalog, joinGroup } from '@/services/groupApi';
import { useUserStore } from '@/stores/userStore';

// 탐색 화면. 목록은 GET /api/v1/groups가 authority다 —
// PUBLIC + RECRUITING 필터링은 백엔드가 하므로 여기서 다시 하지 않는다.
// 카테고리/기간은 받아온 목록을 좁혀 보여주기 위한 표시용 필터일 뿐이다.
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

export default function ExploreScreen() {
  const router = useRouter();
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

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="flex-row items-center justify-between px-[30px] pt-4">
        <Text className="text-[28px] font-bold text-ink">탐색</Text>
        <CoachMascotButton to="/ai" circle={54} size={44} />
      </View>

      <ScrollView
        className="flex-1 px-[30px]"
        contentContainerClassName="gap-4 pb-8 pt-5"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {/* 검색 + 필터 */}
        <View className="flex-row items-center gap-2">
          <View className="h-[45px] flex-1 flex-row items-center gap-2 rounded-[14px] border border-line bg-surface px-4">
            <Icon name="search" size={16} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="그룹 또는 루틴 검색..."
              placeholderTextColor="#6b7268"
              className="flex-1 text-[14px] text-muted"
            />
          </View>
          <Pressable
            onPress={() => {
              setDurationFilter(appliedDuration);
              setFilterOpen(true);
            }}
            className="h-[45px] w-[45px] items-center justify-center rounded-[14px] bg-primary"
          >
            <Icon name="filter" size={18} />
            {hasActiveFilter && <View className="absolute right-[6px] top-[6px] h-[8px] w-[8px] rounded-full bg-[#d9573b]" />}
          </Pressable>
        </View>

        {/* 카테고리 칩 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1.5">
          {categories.map((item) => {
            const active = category === item.label;
            return (
              <Pressable
                key={item.label}
                onPress={() => setCategory(item.label)}
                className={`rounded-[10px] border px-4 py-2.5 ${active ? 'border-primary bg-primary' : 'border-line bg-surface'}`}
              >
                <Text className={`text-[13px] font-semibold ${active ? 'text-surface' : 'text-muted'}`}>{item.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* 마감 임박 */}
        {almostFull && (
          <View className="rounded-[18px] border border-line bg-primary-tint p-4">
            <Pressable onPress={() => router.push(`/explore/group/${almostFull.groupId}`)}>
              <Text className="text-[11px]">
                <Text className="font-bold text-ink">마감 임박 </Text>
                <Text className="font-semibold text-primary">
                  자리 {almostFull.maxMembers - almostFull.currentMembers}개 남았어요
                </Text>
              </Text>
              <Text className="mt-2 text-[16px] font-bold text-ink">{almostFull.name}</Text>
              <View className="mt-2 flex-row items-center gap-2.5">
                <Text className="text-[12px] font-semibold text-ink">{almostFull.currentMembers}/{almostFull.maxMembers}명</Text>
                <Text className="text-[12px] text-ink"><Text className="text-[#d9573b]">♥</Text> 1개</Text>
                <Text className="text-[12px] font-bold text-ink">모집중</Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => { setJoinError(''); setJoinTarget(almostFull); }}
              className="mt-3 self-end rounded-[12px] bg-primary px-3.5 py-2"
            >
              <Text className="text-[12px] font-bold text-surface">참가</Text>
            </Pressable>
          </View>
        )}

        {/* 모집중인 그룹 */}
        <View>
          <Text className="mb-2.5 text-[13px] font-bold text-ink">모집중인 그룹</Text>
          {loading ? (
            <View className="items-center rounded-[16px] border border-line bg-surface p-6">
              <ActivityIndicator color="#4b7f63" />
            </View>
          ) : loadError ? (
            <Pressable onPress={load} className="rounded-[16px] border border-line bg-surface p-4">
              <Text className="text-center text-[13px] text-muted">
                {loadError === ApiError.NETWORK
                  ? '서버에 연결할 수 없어요.'
                  : loadError === ApiError.UNAUTHORIZED
                    ? '로그인이 만료됐어요. 다시 로그인해주세요.'
                    : '목록을 불러오지 못했어요.'}
              </Text>
              <Text className="mt-1 text-center text-[12px] font-bold text-primary">다시 시도</Text>
            </Pressable>
          ) : filteredGroups.length === 0 ? (
            <View className="rounded-[16px] border border-line bg-surface p-4">
              <Text className="text-center text-[13px] text-muted">조건에 맞는 그룹이 없어요.</Text>
            </View>
          ) : (
            <View className="gap-3">
              {filteredGroups.map((group) => {
                const full = group.currentMembers >= group.maxMembers;
                return (
                  <View key={group.groupId} className="flex-row items-center justify-between rounded-[16px] border border-line bg-surface p-4">
                    <Pressable className="flex-1" onPress={() => router.push(`/explore/group/${group.groupId}`)}>
                      <Text className={`text-[15px] font-bold ${full ? 'text-disabled' : 'text-ink'}`}>{group.name}</Text>
                      <Text className={`mt-1.5 text-[12px] ${full ? 'text-disabled' : 'text-muted'}`}>
                        {group.currentMembers}/{group.maxMembers}명 <Text className={full ? '' : 'text-[#d9573b]'}>♥</Text> 1개 필요
                      </Text>
                    </Pressable>
                    <Pressable
                      disabled={full}
                      onPress={() => { setJoinError(''); setJoinTarget(group); }}
                      className={`rounded-[12px] px-3.5 py-2 ${full ? 'bg-[#f9ddd7] opacity-40' : 'bg-primary-tint'}`}
                    >
                      <Text className={`text-[12px] font-bold ${full ? 'text-[#d9573b]' : 'text-[#1f3d2b]'}`}>{full ? '마감' : '참가'}</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* 직접 만들기 */}
        <View className="items-center pt-1">
          <Text className="text-[13px] font-medium text-muted">하고싶은 루틴이 없다면?</Text>
          <Pressable
            onPress={() => router.push('/group/create')}
            className="mt-3 h-[50px] w-full items-center justify-center rounded-[27.5px] bg-primary"
          >
            <Text className="text-[15px] font-bold text-white">직접 그룹 만들기</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/group/join')} className="mt-3">
            <Text className="text-[13px] font-semibold text-muted underline">초대 코드가 있나요? 코드로 참여하기</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* 참가 모달 */}
      <Modal visible={!!joinTarget} transparent animationType="fade" onRequestClose={() => setJoinTarget(null)}>
        <Pressable className="flex-1 items-center justify-center bg-black/40 px-8" onPress={() => !joining && setJoinTarget(null)}>
          <Pressable className="w-full rounded-[20px] bg-surface p-6" onPress={() => {}}>
            <Text className="text-center text-[17px] font-bold text-ink">{joinTarget?.name}</Text>
            <Text className="mt-2 text-center text-[13px] text-muted">이 그룹에 참가할까요? (하트 1개 필요)</Text>
            {joinError ? <Text className="mt-3 text-center text-[12px] font-semibold text-danger">{joinError}</Text> : null}
            <View className="mt-5 flex-row gap-3">
              <Pressable disabled={joining} onPress={() => setJoinTarget(null)} className="flex-1 items-center justify-center rounded-[14px] bg-surface-alt py-3">
                <Text className="text-[14px] font-bold text-ink">취소</Text>
              </Pressable>
              <Pressable disabled={joining} onPress={confirmJoin} className={`flex-1 items-center justify-center rounded-[14px] bg-primary py-3 ${joining ? 'opacity-60' : ''}`}>
                {joining ? <ActivityIndicator color="#fff" /> : <Text className="text-[14px] font-bold text-white">참가하기</Text>}
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 필터 모달 — 모집 상태는 백엔드가 RECRUITING으로 고정하므로 기간만 남긴다 */}
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setFilterOpen(false)}>
          <Pressable className="rounded-t-[24px] bg-surface p-6" onPress={() => {}}>
            <Text className="text-[17px] font-bold text-ink">필터</Text>

            <Text className="mt-4 mb-2 text-[13px] font-bold text-muted">기간</Text>
            <View className="flex-row flex-wrap gap-2">
              {durations.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDurationFilter(d)}
                  className={`rounded-[10px] border px-4 py-2 ${durationFilter === d ? 'border-primary bg-primary' : 'border-line bg-surface'}`}
                >
                  <Text className={`text-[13px] font-semibold ${durationFilter === d ? 'text-surface' : 'text-muted'}`}>{d}</Text>
                </Pressable>
              ))}
            </View>

            <View className="mt-6 flex-row gap-3">
              <Pressable onPress={() => setDurationFilter('전체')} className="flex-1 items-center justify-center rounded-[14px] bg-surface-alt py-3">
                <Text className="text-[14px] font-bold text-ink">초기화</Text>
              </Pressable>
              <Pressable
                onPress={() => { setAppliedDuration(durationFilter); setFilterOpen(false); }}
                className="flex-1 items-center justify-center rounded-[14px] bg-primary py-3"
              >
                <Text className="text-[14px] font-bold text-white">적용</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
