import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Mascot from '@/components/common/Mascot';

// 홈 화면 (웹 src/pages/home/HomePage.jsx 포팅).
// TODO: 작은 아이콘(하트/리워드/차트/불 SVG)은 추후 실제 에셋으로 교체(지금은 이모지).
const SUCCESS_RATE = 60;
const SUCCESS_GOAL = 70;

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      {/* 헤더 */}
      <View className="flex-row items-center justify-between px-[30px] pt-4">
        <Text className="text-[28px] font-bold text-ink">홈</Text>
        <Pressable
          onPress={() => router.push('/ai')}
          accessibilityLabel="AI 코치"
          className="h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-full bg-primary-tint"
        >
          <Mascot size={44} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-[30px]" contentContainerClassName="gap-4 pb-8 pt-5">
        {/* 하트 / 포인트 */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.push('/heart-event')}
            className="flex-1 rounded-[17px] border border-line bg-surface px-4 py-3"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-base">❤️</Text>
              <Text className="text-[18px] font-bold text-ink">3</Text>
            </View>
            <Text className="mt-2 text-[12px] font-semibold text-[#d9573b]">보유 하트</Text>
            <Text className="mt-1 text-[12px] font-semibold text-muted">하트 얻으러 가기 ›</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/reward')}
            className="flex-1 rounded-[17px] border border-line bg-surface px-4 py-3"
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-base">🪙</Text>
              <Text className="text-[18px] font-bold text-ink">1540</Text>
            </View>
            <Text className="mt-2 text-[12px] font-semibold text-reward">포인트</Text>
            <Text className="mt-1 text-[12px] font-semibold text-muted">포인트 혜택 보러가기 ›</Text>
          </Pressable>
        </View>

        {/* 오늘의 루틴 */}
        <View className="overflow-hidden rounded-[20px] border border-line">
          <View className="items-center bg-primary-tint px-5 pb-5 pt-4">
            <Text className="text-[13px] font-semibold text-primary">오늘의 루틴</Text>
            <Text className="mt-2 text-[20px] font-bold text-ink">하루 운동 30분</Text>
            <Pressable
              onPress={() => router.push('/verify')}
              className="mt-4 h-[35px] w-full items-center justify-center rounded-[15px] bg-primary"
            >
              <Text className="text-[12px] font-bold text-[#e5f4e8]">인증하러 하기</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center justify-center gap-4 bg-surface py-3">
            <Text className="text-[13px] font-bold text-ink">마감 오후 10:00</Text>
            <View className="h-[16px] w-px bg-line" />
            <Text className="text-[13px] font-semibold text-ink">3시간 12분 남음</Text>
          </View>
        </View>

        {/* 개인 순위 / 연속 성공 */}
        <View className="h-[81px] flex-row items-center rounded-[15px] border border-line bg-surface">
          <Pressable onPress={() => router.push('/my')} className="flex-1 items-center gap-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs">📊</Text>
              <Text className="text-[12px] font-bold text-ink">개인 순위</Text>
            </View>
            <Text>
              <Text className="text-[25px] font-bold text-primary">2</Text>
              <Text className="text-[12px] font-bold text-ink"> 위 / 5명</Text>
            </Text>
          </Pressable>

          <View className="h-[47px] w-px bg-line" />

          <Pressable onPress={() => router.push('/my')} className="flex-1 items-center gap-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-xs">🔥</Text>
              <Text className="text-[12px] font-bold text-ink">연속 성공</Text>
            </View>
            <Text>
              <Text className="text-[25px] font-bold text-primary">3</Text>
              <Text className="text-[18px] font-bold text-ink">일째</Text>
            </Text>
          </Pressable>
        </View>

        {/* 개인 성공률 게이지 */}
        <View className="rounded-[14px] border border-line bg-surface p-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-semibold text-ink">개인 성공률</Text>
            <Text className="text-[20px] font-bold text-[#669884]">{SUCCESS_RATE}%</Text>
          </View>
          <View className="mt-3 h-[9px] w-full rounded-full bg-[#efefef]">
            <View className="h-full rounded-full bg-[#669884]" style={{ width: `${SUCCESS_RATE}%` }} />
            <View className="absolute top-[13px] -translate-x-1/2 items-center" style={{ left: `${SUCCESS_GOAL}%` }}>
              <Text className="text-[10px] leading-none text-reward">▲</Text>
            </View>
          </View>
          <Text className="mt-2 text-right text-[11px] font-bold text-reward">개인 목표 {SUCCESS_GOAL}%</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
