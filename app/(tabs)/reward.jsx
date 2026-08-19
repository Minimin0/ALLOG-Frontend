import { View, Text, Pressable, ScrollView, Linking } from 'react-native';

import Icon from '@/components/common/Icon';
import { useUserStore } from '@/stores/userStore';

// 보유 포인트는 백엔드 stats가 authority다. 혜택 카탈로그·교환 API는 아직 제공되지 않는다.
const rewards = [
  { id: 'serum-trial', title: 'AAC 시그니처 세럼 체험권', icon: 'ticket' },
  { id: 'discount-15', title: '공식몰 할인 쿠폰', icon: 'coupon' },
  { id: 'free-shipping', title: '무료 배송 쿠폰', icon: 'shipping' },
];

export default function RewardScreen() {
  const points = useUserStore((s) => s.stats?.rewardPoints ?? 0);

  return (
    <View className="flex-1 bg-bg">
      <View className="px-[30px] pt-4">
        <Text className="text-[28px] font-black text-ink">리워드</Text>
      </View>

      <ScrollView className="flex-1 px-[30px]" contentContainerClassName="gap-5 pb-[110px] pt-4">
        <View className="rounded-[13px] bg-[#4a3a18] p-5">
          <Text className="text-[15px] font-semibold text-[#e7e3d8]">보유 리워드 포인트</Text>
          <View className="mt-2 flex-row items-end justify-between">
            <View className="flex-row items-center gap-2">
              <Icon name="coin" size={24} />
              <Text className="text-[30px] font-bold text-[#e7e3d8]">{points}</Text>
            </View>
            <Pressable onPress={() => Linking.openURL('https://anti-agingclub.kr/')}>
              <Text className="pb-1 text-[12px] font-bold text-surface">AAC 홈페이지 바로가기</Text>
            </Pressable>
          </View>
          <View className="my-3 h-px bg-[#e7e3d8]/30" />
          <Text className="text-[10px] font-medium text-[#e7e3d8]">포인트 사용 혜택은 준비 중이에요.</Text>
        </View>

        <View className="rounded-[13px] border border-line bg-surface p-4">
          <Text className="text-[15px] font-bold text-ink">혜택 준비 중</Text>
          <Text className="mt-1 text-[11px] font-medium text-muted">카탈로그와 교환 기능은 아직 제공되지 않아요.</Text>
        </View>

        <View className="gap-3">
          {rewards.map((reward) => (
            <View
              key={reward.id}
              className="flex-row items-center gap-3 rounded-[13px] bg-surface p-4 opacity-70"
            >
              <View className="h-[54px] w-[54px] items-center justify-center rounded-[12px] bg-[#f3efe4]">
                <Icon name={reward.icon} size={26} />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-bold text-ink">{reward.title}</Text>
                <Text className="mt-1 text-[10px] font-medium text-muted">혜택 준비 중</Text>
              </View>
              <View className="rounded-full bg-disabled px-3.5 py-1.5">
                <Text className="text-[10px] font-bold text-white">준비 중</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
