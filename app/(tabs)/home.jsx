import { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';

import CoachMascotButton from '@/components/common/CoachMascotButton';
import Icon from '@/components/common/Icon';
import AnimatedGauge from '@/components/common/AnimatedGauge';
import { useGroupStore } from '@/stores/groupStore';
import { useUserStore } from '@/stores/userStore';
import { colors } from '@/theme';

// 홈 화면. 하트/포인트는 GET /users/me/stats, 오늘의 루틴과 진행 정보는
// GET /me/groups + GET /me/groups/{id}/progress에서 온다. 프론트는 서버가 정한 완주 목표 대비 진행률만 표시한다.

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
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between px-[30px] pt-4">
        <Text className="text-[28px] font-bold text-ink">홈</Text>
        <CoachMascotButton to="/ai" circle={54} size={44} />
      </View>

      <ScrollView
        className="flex-1 px-[30px]"
        contentContainerClassName="gap-4 pb-8 pt-5"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {/* 하트 / 포인트 — 잔액과 혜택 상태는 모두 서버 응답만 표시한다. */}
        <View className="flex-row gap-3">
          <View className="flex-1 rounded-[17px] border border-line bg-surface px-4 py-3">
            <View className="flex-row items-center gap-2">
              <Icon name="heart" size={18} />
              <Text className="text-[18px] font-bold text-ink">{stats?.hearts ?? '–'}</Text>
            </View>
            <Text className="mt-2 text-[12px] font-semibold text-heart">하트</Text>
            <Text className="mt-1 text-[12px] font-medium text-muted">획득 이벤트는 준비 중이에요</Text>
          </View>
          <Pressable
            onPress={() => router.push('/reward')}
            className="flex-1 rounded-[17px] border border-line bg-surface px-4 py-3"
          >
            <View className="flex-row items-center gap-2">
              <Icon name="coin" size={18} />
              <Text className="text-[18px] font-bold text-ink">{stats?.rewardPoints ?? '–'}</Text>
            </View>
            <Text className="mt-2 text-[12px] font-semibold text-reward">포인트</Text>
            <Text className="mt-1 text-[12px] font-semibold text-muted">포인트 혜택 보러가기 ›</Text>
          </Pressable>
        </View>

        {/* 오늘의 루틴 */}
        <View className="overflow-hidden rounded-[20px] border border-line">
          <View className="items-center bg-primary-tint px-5 pb-5 pt-4">
            <Text className="text-[13px] font-semibold text-primary">오늘의 루틴</Text>
            <Text className="mt-2 text-[20px] font-bold text-ink">{current?.groupName ?? '아직 참여 중인 그룹이 없어요'}</Text>
            <Pressable
              onPress={() => router.push(current ? { pathname: '/verify', params: { groupId: String(current.groupId) } } : '/explore')}
              className="mt-4 h-[44px] w-full items-center justify-center rounded-[15px] bg-primary"
            >
              <Text className="text-[13px] font-bold text-mint-badge">{current ? '인증하러 가기' : '그룹 찾아보기'}</Text>
            </Pressable>
          </View>
          {deadline && (
            <View className="flex-row items-center justify-center gap-4 bg-surface py-3">
              <Text className="text-[13px] font-bold text-ink">{deadline}</Text>
              <View className="h-[16px] w-px bg-line" />
              <Text className="text-[13px] font-semibold text-ink">{remainingText(personal.certificationDeadline)}</Text>
            </View>
          )}
        </View>

        {/* 완료 루틴 / 연속 성공 — 순위 API는 아직 없으므로 실제 값만 보여준다 */}
        <View className="h-[81px] flex-row items-center rounded-[15px] border border-line bg-surface">
          <Pressable onPress={() => router.push('/my')} className="flex-1 items-center gap-1">
            <View className="flex-row items-center gap-1.5">
              <Icon name="chart" size={16} />
              <Text className="text-[12px] font-bold text-ink">완료 루틴</Text>
            </View>
            <Text>
              <Text className="text-[25px] font-bold text-primary">{stats?.successfulRoutines ?? 0}</Text>
              <Text className="text-[12px] font-bold text-ink"> 개</Text>
            </Text>
          </Pressable>

          <View className="h-[47px] w-px bg-line" />

          <Pressable onPress={() => router.push('/my')} className="flex-1 items-center gap-1">
            <View className="flex-row items-center gap-1.5">
              <Icon name="fire" size={16} />
              <Text className="text-[12px] font-bold text-ink">연속 성공</Text>
            </View>
            <Text>
              <Text className="text-[25px] font-bold text-primary">{personal?.currentStreak ?? 0}</Text>
              <Text className="text-[12px] font-bold text-ink">일째</Text>
            </Text>
          </Pressable>
        </View>

        {/* 서버가 정한 완주 목표(requiredCompletionCount) 대비 진행률 */}
        <View className="rounded-[14px] border border-line bg-surface p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-semibold text-ink">완주 목표 진행률</Text>
            <Text className="text-[20px] font-bold text-primary-light">{completionProgress}%</Text>
          </View>
          <View className="mt-3 h-[9px] w-full rounded-full bg-[#efefef]">
            <AnimatedGauge percent={completionProgress} color={colors.primaryLight} height={9} />
          </View>
          <Text className="mt-2 text-right text-[11px] font-bold text-reward">완주 목표 {completedTowardGoal} / {required}회</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
