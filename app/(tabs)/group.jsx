import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, View, Text, Pressable, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import CoachMascotButton from '@/components/common/CoachMascotButton';
import AnimatedGauge from '@/components/common/AnimatedGauge';
import CheerOverlay from '@/components/group/CheerOverlay';
import { ApiError } from '@/services/api';
import { issueInviteCode } from '@/services/inviteApi';
import { leaveGroup, cancelGroup } from '@/services/groupApi';
import { useGroupStore } from '@/stores/groupStore';
import { useUserStore } from '@/stores/userStore';
import { colors } from '@/theme';

// 내 그룹. GET /me/groups/{id} + GET /me/groups/{id}/progress가 authority다.
// 멤버 목록·개인 랭킹·멤버별 인증 피드 API는 아직 없어서, 없는 것을 지어내지 않고
// 백엔드가 실제로 주는 값(내 진행률 / 그룹 집계)만 보여준다.

// Pretendard Variable이 안드로이드에서 font-bold를 기대만큼 굵게 그리지 못해서
// 큰 숫자 텍스트에는 시스템 black 폰트로 보정한다 (홈/마이 화면과 동일 패턴).
const statBoldFont = Platform.OS === 'android' ? { fontFamily: 'sans-serif-black' } : null;
const TABS = [
  { key: 'feed', label: '인증' },
  { key: 'ranking', label: '랭킹' },
  { key: 'info', label: '정보' },
];

const GROUP_GOAL_RATE = 80; // 온보딩 안내와 같은 기준
const GROUP_STATUS_LABELS = {
  DRAFT: '작성 중',
  RECRUITING: '모집 중',
  FULL: '정원 달성',
  ACTIVE: '진행 중',
  COMPLETED: '완료됨',
  CANCELLED: '취소됨',
  EXPIRED: '만료됨',
};

function InfoRow({ label, value }) {
  return (
    <View className="flex-row items-center justify-between border-b border-line py-3">
      <Text className="text-[15px] text-muted">{label}</Text>
      <Text className="text-[15px] font-semibold text-ink">{value}</Text>
    </View>
  );
}

function daysBetween(from, to) {
  if (!from || !to) return null;
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Number.isNaN(diff) ? null : Math.round(diff / 86400000);
}

export default function GroupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const paramGroupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId;

  const [tab, setTab] = useState('feed');
  const [toastMsg, setToastMsg] = useState('');
  const [cheerKey, setCheerKey] = useState(0);
  const [cheerOn, setCheerOn] = useState(false);
  const [cheerCount, setCheerCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const cheerTimerRef = useRef(null);
  const toastTimerRef = useRef(null);

  const myGroups = useGroupStore((s) => s.myGroups);
  const detail = useGroupStore((s) => s.detail);
  const progress = useGroupStore((s) => s.progress);
  const loading = useGroupStore((s) => s.detailLoading);
  const listLoading = useGroupStore((s) => s.myGroupsLoading);
  const detailError = useGroupStore((s) => s.detailError);

  const load = useCallback(async () => {
    const store = useGroupStore.getState();
    await store.loadMyGroups();
    const target = paramGroupId ?? store.currentGroup()?.groupId;
    if (target) await store.loadGroup(target);
  }, [paramGroupId]);

  useFocusEffect(
    useCallback(() => {
      setInviteCode(null);
      load();
    }, [load]),
  );

  useEffect(() => () => {
    clearTimeout(cheerTimerRef.current);
    clearTimeout(toastTimerRef.current);
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const toast = (msg) => {
    clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => setToastMsg(''), 2000);
  };

  const cheer = () => {
    setCheerCount((c) => (c % 3) + 1);
    setCheerKey((k) => k + 1);
    setCheerOn(true);
    clearTimeout(cheerTimerRef.current);
    cheerTimerRef.current = setTimeout(() => setCheerOn(false), 1900);
  };

  if ((loading || listLoading) && !detail) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" color={colors.spinner} />
      </View>
    );
  }

  if (!detail) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-bg px-8">
        <Text className="text-center text-[17px] font-bold text-ink">
          {detailError === ApiError.NETWORK ? '서버에 연결할 수 없어요' : '참여 중인 그룹이 없어요'}
        </Text>
        <Text className="text-center text-[13px] text-muted">
          {detailError === ApiError.NETWORK ? '잠시 후 다시 시도해주세요.' : '탐색에서 마음에 드는 그룹을 찾아보세요.'}
        </Text>
        <Pressable onPress={() => (detailError ? load() : router.push('/explore'))} className="w-full items-center rounded-[27.5px] bg-primary py-4">
          <Text className="text-[15px] font-bold text-white">{detailError ? '다시 시도' : '그룹 탐색하기'}</Text>
        </Pressable>
      </View>
    );
  }

  const group = detail.group ?? {};
  const schedule = detail.schedule ?? null;
  const membership = detail.membership ?? {};
  const personal = progress?.personal ?? null;
  const groupProgress = progress?.group ?? null;
  const isOwner = membership.myRole === 'OWNER';
  const started = group.status === 'ACTIVE' || group.status === 'COMPLETED';

  const day = schedule?.startDate ? (daysBetween(schedule.startDate, new Date().toISOString().slice(0, 10)) ?? 0) + 1 : null;
  const dday = schedule?.endDate ? daysBetween(new Date().toISOString().slice(0, 10), schedule.endDate) : null;
  const successRate = groupProgress ? Math.round((groupProgress.groupCompletionRate ?? 0) * 100) : 0;
  const statusLabel = group.status === 'ACTIVE' && day ? `DAY ${day}` : (GROUP_STATUS_LABELS[group.status] ?? group.status);

  const copyShare = async () => {
    try {
      if (group.visibility === 'PUBLIC') {
        await Clipboard.setStringAsync(Linking.createURL(`explore/group/${group.groupId}`));
        return;
      }

      let code = inviteCode;
      if (!code) {
        const response = await issueInviteCode(group.groupId);
        if (!response.ok || !response.data?.code) {
          toast('초대 코드를 만들지 못했어요.');
          return;
        }
        code = response.data.code;
        setInviteCode(code);
      }
      await Clipboard.setStringAsync(code);
      toast('복사했어요!');
    } catch {
      toast('복사하지 못했어요.');
    }
  };

  // 방장은 취소, 멤버는 탈퇴. 하트 환급은 백엔드가 자동으로 한다 — 프론트가 계산하지 않는다.
  const leave = async () => {
    if (leaving) return;
    setLeaving(true);
    const response = isOwner ? await cancelGroup(group.groupId) : await leaveGroup(group.groupId);
    setLeaving(false);

    if (response.ok) {
      await useUserStore.getState().loadStats();
      toast(isOwner ? '그룹을 취소했어요.' : '그룹에서 나왔어요.');
      router.replace('/explore');
      return;
    }
    if (response.errorCode === ApiError.CONFLICT) toast('이미 시작된 그룹은 나갈 수 없어요.');
    else if (response.errorCode === ApiError.NETWORK) toast('서버에 연결할 수 없어요.');
    else toast('처리하지 못했어요.');
  };

  return (
    <View className="flex-1 bg-bg">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between px-[30px] pt-4">
        <Text className="text-[28px] font-bold text-ink">내 그룹</Text>
        {tab !== 'info' ? (
          <CoachMascotButton
            to={`/ai?groupId=${group.groupId}&from=${tab === 'feed' ? 'feed' : 'ranking'}`}
            size={44}
            bare
          />
        ) : (
          <View className="h-14 w-14" />
        )}
      </View>

      {/* 요약 카드 */}
      <View className="px-5 pt-3">
        <View className="rounded-card border border-line bg-primary-tint p-4">
          <Text className="text-[12px] font-bold text-ink">
            {statusLabel}
          </Text>
          <Text className="text-[22px] font-bold text-ink">{group.name}</Text>
          <Text className="mt-1 text-[11px] text-muted">
            {groupProgress
              ? `목표 달성 ${groupProgress.goalAchievedMemberCount}/${groupProgress.eligibleMemberCount}명`
              : '아직 시작 전이에요.'}
          </Text>
          <View className="mt-3 flex-row gap-2">
            {Array.from({ length: group.maxMembers ?? 0 }).map((_, i) => (
              <View
                key={i}
                className={`h-8 w-8 rounded-full ${i < (groupProgress?.goalAchievedMemberCount ?? 0) ? 'bg-primary' : 'bg-surface-alt'}`}
              />
            ))}
          </View>
        </View>
      </View>

      {/* 세그먼트 탭 */}
      <View className="mt-4 flex-row border-b border-line px-5">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable key={t.key} onPress={() => setTab(t.key)} className={`flex-1 items-center border-b-2 pb-2 ${active ? 'border-ink' : 'border-transparent'}`}>
              <Text className={`text-[17px] font-semibold ${active ? 'text-ink' : 'text-muted'}`}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
      >
        {/* 인증 탭 — 멤버별 피드 API가 없어 내 인증 상태만 보여준다 */}
        {tab === 'feed' && (
          <View className="gap-3 p-5">
            <View className="rounded-card border border-line bg-primary-tint p-5">
              <Text className="text-[15px] font-bold text-ink">
                {!personal
                  ? '그룹이 시작되면 인증할 수 있어요.'
                  : personal.todayCompleted
                    ? '오늘 인증을 완료했어요!'
                    : personal.todayVerificationPending
                      ? '인증을 검토하고 있어요.'
                      : personal.todayScheduled
                        ? '아직 오늘 인증을 안했어요.'
                        : '오늘은 인증하는 날이 아니에요.'}
              </Text>
              <Text className="mt-2 text-[12px] text-muted">
                {personal ? `${personal.completedCount}/${personal.requiredCompletionCount}회 완료 · 연속 ${personal.currentStreak}일` : ''}
              </Text>
              {personal?.todayScheduled && !personal.todayCompleted && !personal.todayVerificationPending && (
                <Pressable
                  onPress={() => router.push({ pathname: '/verify', params: { groupId: String(group.groupId) } })}
                  className="mt-4 items-center rounded-pill bg-ink py-3"
                >
                  <Text className="text-[13px] font-bold text-white">인증하기</Text>
                </Pressable>
              )}
            </View>

            <Pressable onPress={cheer} className="items-center rounded-item border border-line bg-surface py-3">
              <Text className="text-[13px] font-bold text-ink">그룹원 응원하기</Text>
            </Pressable>
            <Text className="text-center text-[11px] text-muted">
              멤버별 인증 피드는 아직 준비 중이에요.
            </Text>
          </View>
        )}

        {/* 랭킹 탭 — 랭킹 API가 없다. 가짜 순위를 만들지 않는다. */}
        {tab === 'ranking' && (
          <View className="items-center gap-2 px-5 py-16">
            <Text className="text-[15px] font-bold text-ink">랭킹은 아직 준비 중이에요</Text>
            <Text className="text-center text-[13px] text-muted">
              그룹 공동 진행률은 정보 탭에서 확인할 수 있어요.
            </Text>
          </View>
        )}

        {/* 정보 탭 */}
        {tab === 'info' && (
          <View className="gap-6 px-5 pb-5 pt-8">
            <View>
              <InfoRow label="그룹명" value={group.name} />
              <InfoRow
                label="기간"
                value={schedule ? `${schedule.startDate} ~ ${schedule.endDate}` : '미정'}
              />
              <InfoRow label="정원" value={`${group.maxMembers}명`} />
              <InfoRow label="목표 인증" value={`${group.requiredCompletionCount}회`} />
              <InfoRow label="내 역할" value={membership.myRole === 'OWNER' ? '방장' : '멤버'} />

              {(group.visibility === 'PUBLIC' || isOwner) && (
                <Pressable onPress={copyShare} className="flex-row items-center justify-between border-b border-line py-3">
                  <Text className="text-[15px] text-muted">{group.visibility === 'PUBLIC' ? '그룹 링크' : '초대 코드'}</Text>
                  <Text className="text-[15px] font-semibold text-ink">
                    {group.visibility === 'PUBLIC' ? '링크 복사하기 📎' : inviteCode ? '코드 복사하기 ›' : '코드 받기 ›'}
                  </Text>
                </Pressable>
              )}
            </View>

            <View className="rounded-item border border-line bg-surface p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-[11px] font-semibold text-ink">우리 그룹 공동 성공률</Text>
                <Text className="text-[25px] font-bold text-primary" style={statBoldFont}>{successRate}%</Text>
              </View>
              <View className="mt-2 h-2 w-full rounded-pill bg-disabled">
                <AnimatedGauge percent={successRate} color={colors.primary} height={8} />
                <View className="absolute -top-1 h-4 w-0.5 bg-reward" style={{ left: `${GROUP_GOAL_RATE}%` }} />
              </View>
              <View className="mt-1 flex-row justify-between">
                <Text className="text-[11px] text-muted">
                  {groupProgress ? `${groupProgress.completedRequirementCount}/${groupProgress.totalRequiredCount}회 완료` : '시작 전'}
                </Text>
                <Text className="text-[11px] text-reward">그룹 목표 {GROUP_GOAL_RATE}%</Text>
              </View>
            </View>

            <View className="flex-row rounded-item border border-line bg-surface py-4">
              <View className="flex-1 items-center border-r border-line">
                <Text className="text-[12px] font-bold text-ink">남은 기간</Text>
                <Text className="mt-1 text-[30px] font-bold text-primary" style={statBoldFont}>{dday === null ? '–' : `D-${Math.max(0, dday)}`}</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-[12px] font-bold text-ink">내 달성</Text>
                <Text className="mt-1 text-[30px] font-bold text-primary" style={statBoldFont}>
                  {personal ? `${personal.completedCount}/${personal.requiredCompletionCount}` : '–'}
                </Text>
              </View>
            </View>

            {/* 시작 후 나가기는 백엔드 정책상 지원하지 않는다(409). 시작 전에만 노출한다. */}
            {!started && (
              <Pressable onPress={leave} disabled={leaving} className={`items-center rounded-item border border-line bg-surface py-3 ${leaving ? 'opacity-50' : ''}`}>
                <Text className="text-[13px] font-bold text-danger">{isOwner ? '그룹 취소하기' : '그룹 나가기'}</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      {cheerOn && <CheerOverlay key={cheerKey} usedCount={cheerCount} />}

      {!!toastMsg && (
        <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
          <Animated.View
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(320)}
            className="rounded-pill bg-surface px-6 py-3 shadow"
            style={{ borderWidth: 1, borderColor: colors.line }}
          >
            <Text className="text-[15px] font-semibold text-primary">{toastMsg}</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}
