import { useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Icon from '@/components/common/Icon';
import { useUserStore } from '@/stores/userStore';

export default function HeartEventScreen() {
  const router = useRouter();
  const hearts = useUserStore((s) => s.stats?.hearts ?? 0);

  useEffect(() => {
    useUserStore.getState().loadStats();
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="relative flex-row items-center px-7 pt-4">
        <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-primary">
          <Text className="text-lg text-white">‹</Text>
        </Pressable>
        <Text className="absolute left-0 right-0 text-center text-[19px] font-semibold text-ink">하트 안내</Text>
      </View>

      <ScrollView className="flex-1 px-7" contentContainerClassName="pb-8 pt-8">
        <View className="flex-row items-start justify-between gap-3">
          <View className="max-w-[220px]">
            <Text className="text-[25px] font-bold text-ink" style={{ lineHeight: 32 }}>하트로{ '\n' }그룹에 참여해요</Text>
            <Text className="mt-3 text-[10px] font-medium text-subtle">하트는 그룹 참가에 사용하는 참여 자원이에요.</Text>
          </View>
          <View className="w-[114px] items-center gap-1 rounded-[7px] border border-line bg-surface py-3">
            <View className="flex-row items-center gap-1.5"><Icon name="heart" size={17} /><Text className="text-[18px] font-bold text-ink">{hearts}</Text></View>
            <Text className="text-[12px] font-semibold text-[#d9573b]">보유 하트</Text>
          </View>
        </View>

        <View className="mt-9 gap-4">
          <View className="rounded-[13px] border border-line bg-white p-5">
            <Text className="text-[15px] font-bold text-ink">하트 사용 안내</Text>
            <View className="mt-4 gap-3">
              <Text className="text-[13px] font-semibold text-subtle">그룹에 참가할 때 하트 1개를 사용해요.</Text>
              <Text className="text-[13px] font-semibold text-subtle">시작 전에 참가를 취소하거나 그룹이 취소되면 환급은 서버에서 자동 처리돼요.</Text>
            </View>
          </View>
          <View className="rounded-[13px] border border-line bg-white p-5">
            <Text className="text-[15px] font-bold text-ink">하트 획득 이벤트는 준비 중이에요.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
