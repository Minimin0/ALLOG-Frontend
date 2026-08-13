import { useEffect } from 'react';
import { View, Image } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import Confetti from '@/components/group/Confetti';

// 응원 오버레이 (웹 CheerOverlay 포팅): 어두운 배경 + 폭죽 + 응원 캐릭터 3개 팝인/통통.
const CHEER = require('../../../assets/images/cheer-heart.png');
const RATIO = 973 / 659; // 원본 비율(세로/가로)
const AnimatedImage = Animated.createAnimatedComponent(Image);

function CheerChar({ delay, width }) {
  const scale = useSharedValue(0);
  const y = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 320, easing: Easing.out(Easing.back(1.7)) }));
    y.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(-10, { duration: 480 }), withTiming(0, { duration: 480 })), -1, true),
    );
  }, []);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { translateY: y.value }] }));

  return (
    <AnimatedImage
      source={CHEER}
      resizeMode="contain"
      style={[{ width, height: width * RATIO }, style]}
    />
  );
}

export default function CheerOverlay() {
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(300)}
      pointerEvents="none"
      className="absolute inset-0 items-center justify-center bg-black/50"
    >
      <Confetti />
      <View className="flex-row items-end gap-1">
        <CheerChar delay={0} width={78} />
        <CheerChar delay={120} width={104} />
        <CheerChar delay={240} width={78} />
      </View>
    </Animated.View>
  );
}
