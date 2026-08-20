import { useCallback, useState } from 'react';
import { Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import CoachMascotButton from '@/components/common/CoachMascotButton';
import Icon from '@/components/common/Icon';
import AnimatedGauge from '@/components/common/AnimatedGauge';
import AnimatedEntrance from '../../mobile/src/components/AnimatedEntrance';
import { useGroupStore } from '@/stores/groupStore';
import { useUserStore } from '@/stores/userStore';

// 홈 화면. 하트/포인트는 GET /users/me/stats, 오늘의 루틴과 성공률은
// GET /me/groups + GET /me/groups/{id}/progress에서 온다. 프론트는 계산하지 않고 표시만 한다.
// 화면 디자인은 팀원 최신본(mobile/src/screens/main/HomeNative.js) 이식 —
// 도너가 박아둔 값("하루 운동 30분", "2위 / 5명", "60%")은 쓰지 않고 실제 백엔드 값을 그대로 쓴다.
// 진행률은 서버가 정한 완주 목표(requiredCompletionCount) 대비로만 표시한다.

function formatDeadline(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  const hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0');
  const meridiem = hour < 12 ? '오전' : '오후';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `마감 ${meridiem} ${display}:${minute}`;
}

function remainingText(iso) {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  if (Number.isNaN(diff) || diff <= 0) return '마감됨';
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return `${hours}시간 ${minutes}분 남음`;
}

export default function HomeScreen() {
  const router = useRouter();
  const stats = useUserStore((s) => s.stats);
  const myGroups = useGroupStore((s) => s.myGroups);
  const progress = useGroupStore((s) => s.progress);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    await Promise.all([useUserStore.getState().loadStats(), useGroupStore.getState().loadMyGroups()]);
    const current = useGroupStore.getState().currentGroup();
    if (current) await useGroupStore.getState().loadGroup(current.groupId);
  }, []);

  // 탭으로 돌아올 때마다 갱신한다 — 참가/인증 후 하트와 진행률이 바로 반영돼야 한다.
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

  const current = myGroups.find((g) => g.groupStatus === 'ACTIVE') ?? myGroups[0] ?? null;
  const personal = progress?.personal ?? null;
  const required = personal?.requiredCompletionCount ?? 0;
  const completed = personal?.completedCount ?? 0;
  const completedTowardGoal = Math.min(completed, required);
  const completionProgress = required > 0 ? Math.round((completedTowardGoal / required) * 100) : 0;
  const deadline = formatDeadline(personal?.certificationDeadline);

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text className="text-[28px] font-black text-ink">홈</Text>
        <CoachMascotButton to="/ai" />
      </View>

      <ScrollView
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {/* 하트 / 포인트 */}
        <AnimatedEntrance style={s.row}>
          <Card
            icon={<Icon name="heart" size={19} />}
            value={String(stats?.hearts ?? '–')}
            label="보유 하트"
            note="하트 안내 보기 >"
            onPress={() => router.push('/heart-event')}
          />
          <Card
            icon={<Icon name="coin" size={18} />}
            value={String(stats?.rewardPoints ?? '–')}
            label="포인트"
            labelColor="#c08a24"
            note="포인트 혜택 보러가기 >"
            onPress={() => router.push('/reward')}
          />
        </AnimatedEntrance>

        {/* 오늘의 루틴 */}
        <AnimatedEntrance delay={60} style={s.routine}>
          <View style={s.routineTop}>
            <Text style={s.smallGreen}>오늘의 루틴</Text>
            <Text style={s.routineTitle}>{current?.groupName ?? '아직 참여 중인 그룹이 없어요'}</Text>
            <Pressable
              style={s.verify}
              onPress={() =>
                router.push(current ? { pathname: '/verify', params: { groupId: String(current.groupId) } } : '/explore')
              }
            >
              <Text style={s.verifyText}>{current ? '인증하러 가기' : '그룹 찾아보기'}</Text>
            </Pressable>
          </View>
          {deadline ? (
            <View style={s.routineBottom}>
              <Text style={s.deadline}>{deadline}</Text>
              <View style={s.vline} />
              <Text style={s.deadline}>{remainingText(personal.certificationDeadline)}</Text>
            </View>
          ) : null}
        </AnimatedEntrance>

        {/* 완료 루틴 / 연속 성공 — 순위 API는 아직 없으므로 실제 값만 보여준다 */}
        <AnimatedEntrance delay={120}>
          <View style={s.stats}>
            <Pressable style={s.stat} onPress={() => router.push('/my')}>
              <View style={s.inline}>
                <Icon name="chart" size={16} />
                <Text style={s.statLabel}>완료 루틴</Text>
              </View>
              <View style={s.statValueRow}>
                <Text style={s.statBig}>{stats?.successfulRoutines ?? 0}</Text>
                <Text style={s.daySuffix}> 개</Text>
              </View>
            </Pressable>
            <View style={s.vlineTall} />
            <Pressable style={s.stat} onPress={() => router.push('/my')}>
              <View style={s.inline}>
                <Icon name="fire" size={16} />
                <Text style={s.statLabel}>연속 성공</Text>
              </View>
              <View style={s.statValueRow}>
                <Text style={s.statBig}>{personal?.currentStreak ?? 0}</Text>
                <Text style={s.daySuffix}> 일째</Text>
              </View>
            </Pressable>
          </View>
        </AnimatedEntrance>

        {/* 서버가 정한 완주 목표(requiredCompletionCount) 대비 진행률 */}
        <AnimatedEntrance delay={180} style={s.gaugeCard}>
          <View style={s.between}>
            <Text style={s.gaugeLabel}>완주 목표 진행률</Text>
            <Text style={s.rate}>{completionProgress}%</Text>
          </View>
          <View style={s.track}>
            <AnimatedGauge percent={completionProgress} color="#669884" height={9} />
          </View>
          <Text style={s.goal}>완주 목표 {completedTowardGoal} / {required}회</Text>
        </AnimatedEntrance>
      </ScrollView>
    </View>
  );
}

function Card({ icon, value, label, labelColor, note, onPress }) {
  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.inline}>
        {icon}
        <Text style={s.value}>{value}</Text>
      </View>
      <Text style={[s.cardLabel, labelColor && { color: labelColor }]}>{label}</Text>
      <Text style={s.note}>{note}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f6f3' },
  header: {
    paddingHorizontal: 30,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: { paddingHorizontal: 30, paddingTop: 20, paddingBottom: 110, gap: 16 },
  row: { flexDirection: 'row', gap: 12 },
  card: {
    flex: 1,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  value: { fontSize: 18, fontWeight: '700' },
  cardLabel: { marginTop: 8, fontSize: 12, fontWeight: '600', color: '#d9573b' },
  note: { marginTop: 4, fontSize: 12, fontWeight: '600', color: '#6b7268' },
  routine: { borderRadius: 20, borderWidth: 1, borderColor: '#e7e3d8', overflow: 'hidden' },
  routineTop: {
    backgroundColor: '#edf2ec',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  smallGreen: { fontSize: 13, fontWeight: '600', color: '#14453a' },
  routineTitle: { marginTop: 8, fontSize: 20, fontWeight: '700' },
  verify: {
    marginTop: 16,
    width: '100%',
    height: 35,
    borderRadius: 15,
    backgroundColor: '#14453a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyText: { fontSize: 12, fontWeight: '700', color: '#e5f4e8' },
  routineBottom: {
    height: 42,
    backgroundColor: '#fefefe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  deadline: { fontSize: 13, fontWeight: '700' },
  vline: { width: 1, height: 16, backgroundColor: '#e7e3d8' },
  stats: {
    height: 81,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: { flex: 1, alignItems: 'center', gap: 4 },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  statLabel: { fontSize: 12, fontWeight: '700' },
  statBig: {
    fontFamily: Platform.OS === 'android' ? 'sans-serif-black' : undefined,
    fontSize: 25,
    fontWeight: '900',
    color: '#14453a',
    textShadowColor: '#14453a',
    textShadowOffset: { width: 0.7, height: 0 },
    textShadowRadius: 0,
  },
  daySuffix: { fontSize: 12, fontWeight: '700' },
  vlineTall: { width: 1, height: 47, backgroundColor: '#e7e3d8' },
  gaugeCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    padding: 16,
  },
  between: { flexDirection: 'row', justifyContent: 'space-between' },
  gaugeLabel: { fontSize: 13, fontWeight: '600' },
  rate: { fontSize: 20, fontWeight: '900', color: '#669884' },
  track: { position: 'relative', marginTop: 12, height: 9, borderRadius: 5, backgroundColor: '#efefef' },
  goal: { marginTop: 8, textAlign: 'right', fontSize: 11, fontWeight: '700', color: '#c08a24' },
});
