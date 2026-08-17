import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';

import Icon from '@/components/common/Icon';

// 하트 하나: 통통 튀며 나타난 뒤 살짝 위아래로 계속 움직임.
function AnimatedHeart({ delay }) {
  const scale = useSharedValue(0);
  const y = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 340, easing: Easing.out(Easing.back(1.8)) }));
    y.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(-5, { duration: 520 }), withTiming(0, { duration: 520 })), -1, true),
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { translateY: y.value }] }));

  return (
    <Animated.View style={style}>
      <Icon name="heart" size={34} />
    </Animated.View>
  );
}

// 온보딩 완료 (웹 OnboardingCompletePage 포팅).
export default function OnboardingCompleteScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg px-5">
      <View className="flex-1 items-center pt-16">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Text className="text-[28px] text-white">✓</Text>
        </View>

        <Text className="mt-6 text-center text-[25px] font-bold text-ink" style={{ lineHeight: 32 }}>환영합니다!{'\n'}하트 3개를 받았어요.</Text>

        <View className="mt-6 flex-row gap-3">
          <AnimatedHeart delay={0} />
          <AnimatedHeart delay={120} />
          <AnimatedHeart delay={240} />
        </View>

        <Text className="mt-6 text-center text-[18px] font-semibold text-subtle">
          <Text className="font-bold text-[#d9573b]">하트</Text>는 <Text className="font-bold text-ink">그룹 참가</Text>에만 사용돼요.
        </Text>

        {/* 하트 안내 — 가독성 개선: 진한 색 강조 + 조건/보상을 카드로 분리 */}
        <View className="mt-6 w-full gap-4 rounded-[23px] border border-line bg-surface p-5">
          <View className="flex-row items-center justify-center gap-1.5">
            <Icon name="heart" size={15} />
            <Text className="text-center text-[13px] font-bold text-ink">
              그룹에 참가할 때 <Text className="text-[#d9573b]">하트 1개</Text>를 사용해요
            </Text>
          </View>
          <View className="h-px w-full bg-line" />
          <View className="flex-row items-center gap-2.5">
            <View className="flex-1 rounded-[14px] bg-bg px-3 py-3.5">
              <Text className="text-center text-[12px] font-semibold text-ink" style={{ lineHeight: 18 }}>
                그룹 공동 성공률 80% 이상{'\n'}+{'\n'}개인 달성률 70% 이상
              </Text>
            </View>
            <Text className="text-[18px] font-bold text-disabled">→</Text>
            <View className="flex-1 rounded-[14px] bg-[#fdece5] px-3 py-3.5">
              <Text className="text-center text-[12px] font-bold text-[#d9573b]" style={{ lineHeight: 18 }}>
                하트 1개를{'\n'}다시 받아요
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View className="pb-7">
        <Pressable onPress={() => router.replace('/home')} className="w-full items-center justify-center rounded-[27.5px] bg-primary py-[18px]">
          <Text className="text-[15px] font-bold text-white">홈으로 가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
