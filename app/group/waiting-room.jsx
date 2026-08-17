import { useCallback, useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useGroupStore from '@/stores/groupStore';

function valueOf(param) {
  return Array.isArray(param) ? param[0] : param;
}

export default function WaitingRoomScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = valueOf(params.groupId);
  const detail = useGroupStore((state) => state.detail);
  const loading = useGroupStore((state) => state.detailLoading);
  const error = useGroupStore((state) => state.detailError);

  const load = useCallback(() => {
    if (!groupId) return Promise.resolve();
    return useGroupStore.getState().loadGroup(groupId);
  }, [groupId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!groupId) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center bg-bg px-7">
        <Text className="text-center text-[16px] font-semibold text-ink">그룹 정보를 찾을 수 없어요.</Text>
        <Pressable onPress={() => router.replace('/(tabs)/group')} className="mt-5 rounded-[24px] bg-primary px-5 py-3">
          <Text className="font-bold text-white">내 그룹으로 이동</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (loading && !detail) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator color="#669884" />
      </SafeAreaView>
    );
  }

  if (!detail) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center bg-bg px-7">
        <Text className="text-center text-[16px] font-semibold text-ink">그룹 정보를 불러오지 못했어요.</Text>
        <Text className="mt-2 text-center text-[13px] text-subtle">{error ?? '잠시 후 다시 시도해 주세요.'}</Text>
        <Pressable onPress={load} className="mt-5 rounded-[24px] bg-primary px-5 py-3">
          <Text className="font-bold text-white">다시 시도</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { group, routine, schedule, membership } = detail;
  const scheduleText = schedule
    ? `${schedule.startDate} ~ ${schedule.endDate} · ${schedule.deadlineTime}`
    : '일정 정보 없음';

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="gap-4 px-7 py-8">
        <Text className="text-[22px] font-bold text-ink">대기방</Text>
        <Text className="text-[14px] text-subtle">그룹이 시작되면 서버 상태에 따라 자동으로 진행 화면이 갱신됩니다.</Text>

        <View className="rounded-[16px] border border-line bg-white p-5">
          <Text className="text-[18px] font-bold text-ink">{group.name}</Text>
          <Text className="mt-2 text-[13px] text-subtle">{routine?.name ?? '루틴 정보 없음'}</Text>
          <View className="mt-5 gap-3">
            <Text className="text-[14px] font-semibold text-ink">{group.currentMembers ?? '—'} / {group.maxMembers}명 모집 중</Text>
            <Text className="text-[13px] text-subtle">상태: {group.status}</Text>
            <Text className="text-[13px] text-subtle">역할: {membership?.myRole ?? '—'} · 참여 상태: {membership?.myStatus ?? '—'}</Text>
            <Text className="text-[13px] text-subtle">일정: {scheduleText}</Text>
          </View>
        </View>

        <Pressable onPress={() => router.replace('/(tabs)/group')} className="mt-2 items-center rounded-[27px] bg-primary py-4">
          <Text className="text-[15px] font-bold text-white">내 그룹으로 이동</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
