import { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import { ApiError } from '@/services/api';
import { fetchMyGroupDetail, fetchPublicGroups, joinGroup } from '@/services/groupApi';
import { useUserStore } from '@/stores/userStore';
import { colors } from '@/theme';

// 공개 그룹 상세. 공개 그룹만 조회하는 단건 API는 없으므로 GET /api/v1/groups 목록에서 찾는다.
// 이미 멤버라면 GET /me/groups/{id}가 200을 주므로 그것으로 참가 여부를 판정한다.
// 멤버 목록·랭킹 API는 아직 없어서 있는 척하지 않는다.
export default function GroupDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId;

  const [group, setGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [list, mine] = await Promise.all([fetchPublicGroups(), fetchMyGroupDetail(groupId)]);

    if (mine.ok) {
      setIsMember(true);
      const g = mine.data?.group ?? {};
      setGroup({
        groupId: g.groupId,
        name: g.name,
        visibility: g.visibility,
        status: g.status,
        maxMembers: g.maxMembers,
        currentMembers: null,
        requiredCompletionCount: g.requiredCompletionCount,
        routine: mine.data?.routine ?? null,
        schedule: mine.data?.schedule ?? null,
      });
      setLoadError(null);
    } else if (list.ok) {
      const found = (list.data?.items ?? []).find((g) => String(g.groupId) === String(groupId)) ?? null;
      setGroup(found);
      setLoadError(found ? null : ApiError.NOT_FOUND);
    } else {
      setLoadError(list.errorCode);
    }
    setLoading(false);
  }, [groupId]);

  useEffect(() => {
    load();
  }, [load]);

  const join = async () => {
    if (joining) return;
    setJoining(true);
    setError('');

    const response = await joinGroup(groupId);
    setJoining(false);

    if (response.ok) {
      await useUserStore.getState().loadStats();
      router.replace({ pathname: '/group/join-complete', params: { groupId: String(groupId), title: group?.name ?? '' } });
      return;
    }
    if (response.errorCode === ApiError.INSUFFICIENT_HEARTS) setError('하트가 부족해요. 하트를 먼저 얻어주세요.');
    else if (response.errorCode === ApiError.CONFLICT) {
      // 본문 없는 409는 이미 참가/정원 초과/비공개 중 하나 — 구분할 수 없으므로 다시 읽는다.
      setError('지금은 참가할 수 없는 그룹이에요.');
      load();
    } else if (response.errorCode === ApiError.NOT_FOUND) setError('사라진 그룹이에요.');
    else if (response.errorCode === ApiError.NETWORK) setError('서버에 연결할 수 없어요.');
    else setError('참가에 실패했어요.');
  };

  if (loading) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator size="large" color={colors.spinner} />
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 items-center justify-center gap-4 bg-bg px-8">
        <Text className="text-center text-[17px] font-bold text-ink">
          {loadError === ApiError.NETWORK ? '서버에 연결할 수 없어요' : '그룹을 찾을 수 없어요'}
        </Text>
        <Pressable onPress={() => router.back()} className="w-full items-center rounded-[27.5px] bg-black py-4">
          <Text className="text-[15px] font-bold text-white">돌아가기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const full = group.currentMembers !== null && group.currentMembers >= group.maxMembers;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      {/* 헤더 */}
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-full border border-line bg-surface">
          <Text className="text-xl text-ink">‹</Text>
        </Pressable>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-[18px] font-bold text-ink" numberOfLines={1}>{group.name}</Text>
            <View className="rounded-full bg-primary-pale px-2 py-0.5">
              <Text className="text-[11px] font-bold text-primary">{group.status}</Text>
            </View>
          </View>
          {group.currentMembers !== null && (
            <Text className="mt-0.5 text-[11px] font-semibold text-subtle">
              {group.currentMembers}/{group.maxMembers}명 참여 중
            </Text>
          )}
        </View>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-4 py-5 pb-28">
        <View className="rounded-[15px] border border-line bg-surface p-4">
          {[
            ['루틴', group.routine?.name ?? '–'],
            ['기간', group.schedule ? `${group.schedule.startDate} ~ ${group.schedule.endDate}` : '미정'],
            ['인증 마감', group.schedule?.deadlineTime?.slice(0, 5) ?? '–'],
            ['정원', `${group.maxMembers}명`],
            ['목표 인증', `${group.requiredCompletionCount}회`],
            ['공개 범위', group.visibility === 'PRIVATE' ? '비공개' : '공개'],
          ].map(([label, value], i, all) => (
            <View key={label} className={`flex-row items-center justify-between py-2.5 ${i < all.length - 1 ? 'border-b border-line' : ''}`}>
              <Text className="text-[13px] font-semibold text-subtle">{label}</Text>
              <Text className="text-[13px] font-bold text-ink">{value}</Text>
            </View>
          ))}
        </View>

        {group.routine?.description ? (
          <View className="rounded-[15px] border border-line bg-surface p-4">
            <Text className="text-[13px] leading-5 text-subtle">{group.routine.description}</Text>
          </View>
        ) : null}

        <Text className="text-center text-[11px] text-muted">
          멤버 목록과 랭킹은 아직 준비 중이에요.
        </Text>
      </ScrollView>

      {/* 참가 버튼 (하단 고정) */}
      <View className="border-t border-line bg-surface px-5 py-4">
        {error ? <Text className="mb-2 text-center text-[12px] font-semibold text-danger">{error}</Text> : null}
        {isMember ? (
          <Pressable
            onPress={() => router.replace({ pathname: '/group', params: { groupId: String(groupId) } })}
            className="items-center justify-center rounded-[27.5px] bg-black py-4"
          >
            <Text className="text-[15px] font-bold text-white">내 그룹에서 보기</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={join}
            disabled={joining || full}
            className={`items-center justify-center rounded-[27.5px] bg-black py-4 ${joining || full ? 'opacity-50' : ''}`}
          >
            {joining
              ? <ActivityIndicator color={colors.white} />
              : <Text className="text-[15px] font-bold text-white">{full ? '정원이 찼어요' : '그룹 참가하기 (♥ 1개 사용)'}</Text>}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
