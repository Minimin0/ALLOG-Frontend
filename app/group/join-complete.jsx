import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

import Icon from '@/components/common/Icon';
import { useUserStore } from '@/stores/userStore';

// 그룹 참가 완료. 하트 차감은 이미 백엔드가 끝냈다 — 잔여 하트는 계산하지 않고 stats에서 읽는다.
export default function JoinCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId;
  const title = (Array.isArray(params.title) ? params.title[0] : params.title) ?? '새 그룹';
  const hearts = useUserStore((s) => s.stats?.hearts);

  useEffect(() => {
    useUserStore.getState().loadStats();
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg px-5">
      <View className="flex-1 items-center pt-20">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Text className="text-[28px] text-white">✓</Text>
        </View>

        <Text className="mt-6 text-center text-[25px] font-bold text-ink">그룹 참가 완료!</Text>
        <Text className="mt-2 text-center text-[16px] font-medium">
          <Text className="text-primary">{title}</Text>
          <Text className="text-muted"> 그룹에 참가했어요.</Text>
        </Text>
        <Text className="mt-6 text-center text-[18px] font-semibold text-subtle">
          <Text className="font-bold text-[#d9573b]">하트</Text> 1개가 사용됐어요.
        </Text>

        <View className="mt-8 w-[243px] items-center rounded-full border border-line bg-surface py-6">
          <Text className="text-[15px] font-semibold text-[#d9573b]">잔여 하트 수</Text>
          <View className="mt-1 flex-row items-center gap-2">
            <Icon name="heart" size={20} />
            <Text className="text-[18px] font-bold text-ink">{hearts ?? '–'}</Text>
          </View>
          <Pressable onPress={() => router.push('/heart-event')} className="mt-2">
            <Text className="text-[12px] font-semibold text-muted">하트 얻으러 가기 ›</Text>
          </Pressable>
        </View>
      </View>

      <View className="gap-4 pb-8">
        <Pressable onPress={() => router.replace(groupId ? { pathname: '/group', params: { groupId } } : '/group')} className="h-[50px] items-center justify-center rounded-[27.5px] bg-ink">
          <Text className="text-[15px] font-bold text-white">그룹으로 이동</Text>
        </Pressable>
        <Pressable onPress={() => router.replace('/explore')} className="items-center">
          <Text className="text-[15px] font-semibold text-muted">나중에 볼게요</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
