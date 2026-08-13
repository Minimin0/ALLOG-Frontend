import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Icon from '@/components/common/Icon';

// 리워드 화면 (웹 src/pages/reward/RewardPage.jsx 포팅).
const categories = ['체험', '상품', '기타', '전체'];
const sortOptions = ['인기 높은 순', '가격 높은 순', '가격 낮은 순'];
const points = 1540;
const rewards = [
  { id: 'serum-trial', title: 'AAC 시그니처 세럼 체험권', cost: 1500, note: '교환 후 30일 이내 사용', icon: 'ticket' },
  { id: 'discount-15', title: '공식몰 15% 할인 쿠폰', cost: 2000, note: '교환 후 30일 이내 사용', icon: 'coupon' },
  { id: 'free-shipping', title: '무료 배송 쿠폰(3만원 이상)', cost: 2000, note: '교환 후 30일 이내 사용', icon: 'shipping' },
];

export default function RewardScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('전체');
  const [sort, setSort] = useState(sortOptions[0]);
  const [sortOpen, setSortOpen] = useState(false);

  const sortedRewards = [...rewards].sort((a, b) => {
    if (sort === '가격 높은 순') return b.cost - a.cost;
    if (sort === '가격 낮은 순') return a.cost - b.cost;
    return 0;
  });

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="px-[30px] pt-4">
        <Text className="text-[28px] font-bold text-ink">리워드</Text>
      </View>

      <ScrollView className="flex-1 px-[30px]" contentContainerClassName="gap-5 pb-8 pt-4">
        {/* 포인트 카드 */}
        <View className="rounded-[13px] bg-[#4a3a18] p-5">
          <Text className="text-[15px] font-semibold text-[#e7e3d8]">사용가능한 리워드 포인트</Text>
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
          <Text className="text-[10px] font-medium text-[#e7e3d8]">포인트는 ACC 상품과 웰니스 혜택에만 사용돼요.</Text>
        </View>

        {/* 카테고리 */}
        <View className="flex-row gap-2.5">
          {categories.map((item) => {
            const active = category === item;
            return (
              <Pressable
                key={item}
                onPress={() => setCategory(item)}
                className="flex-1 items-center rounded-[10px] bg-surface py-2.5"
              >
                <Text className={`text-[13px] font-semibold ${active ? 'text-ink' : 'text-muted'}`}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* 정렬 */}
        <View className="z-10 items-end">
          <Pressable
            onPress={() => setSortOpen((p) => !p)}
            className="flex-row items-center gap-1.5 rounded-[6px] bg-line px-3.5 py-1.5"
          >
            <Text className="text-[13px] font-semibold text-[#696973]">{sort}</Text>
            <Text className="text-[10px] text-[#696973]">{sortOpen ? '⌃' : '⌄'}</Text>
          </Pressable>
          {sortOpen && (
            <View className="absolute right-0 top-[36px] w-[140px] overflow-hidden rounded-[12px] bg-surface py-1 shadow">
              {sortOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    setSort(option);
                    setSortOpen(false);
                  }}
                  className="px-4 py-2.5"
                >
                  <Text className={`text-[12px] font-semibold ${sort === option ? 'text-ink' : 'text-[#696973]'}`}>{option}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* 리워드 목록 */}
        <View className="gap-3">
          {sortedRewards.map((reward) => {
            const canAfford = points >= reward.cost;
            return (
              <Pressable
                key={reward.id}
                onPress={() => router.push(`/reward/${reward.id}`)}
                className="flex-row items-center gap-3 rounded-[13px] bg-surface p-4"
              >
                <View className="h-[54px] w-[54px] items-center justify-center rounded-[12px] bg-[#f3efe4]">
                  <Icon name={reward.icon} size={26} />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-bold text-ink">{reward.title}</Text>
                  <Text className="mt-1 text-[10px] font-medium text-muted">{reward.note}</Text>
                  <View className="mt-1.5 flex-row items-center gap-1">
                    <Icon name="coin" size={14} />
                    <Text className="text-[15px] font-bold text-ink">{reward.cost}</Text>
                  </View>
                </View>
                <View className={`rounded-full px-3.5 py-1.5 ${canAfford ? 'bg-primary' : 'bg-disabled'}`}>
                  <Text className="text-[10px] font-bold text-white">{canAfford ? '교환하기' : '포인트 부족'}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
