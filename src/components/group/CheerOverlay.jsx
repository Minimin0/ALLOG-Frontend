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

// 응원 오버레이 (웹 CheerOverlay 포팅): 어두운 배경 + 폭죽 + 응원 캐릭터 3개.
// usedCount 만큼 앞에서부터 '하트 없는(plain)' 캐릭터로 바뀐다 (응원할수록 하트 소진).
const HEART = require('../../../assets/images/cheer-heart.png');
const PLAIN = require('../../../assets/images/cheer-plain.png');
const HEART_RATIO = 973 / 659; // 세로/가로
const PLAIN_RATIO = 998 / 816;
const AnimatedImage = Animated.createAnimatedComponent(Image);

function CheerChar({ delay, width, plain }) {
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
  const ratio = plain ? PLAIN_RATIO : HEART_RATIO;

  return (
    <AnimatedImage source={plain ? PLAIN : HEART} resizeMode="contain" style={[{ width, height: width * ratio }, style]} />
  );
}

export default function CheerOverlay({ usedCount = 1 }) {
  // 앞에서부터 usedCount개는 plain(하트 사용됨), 나머지는 heart.
  return (
    <Animated.View
      entering={FadeIn.duration(150)}
      exiting={FadeOut.duration(300)}
      pointerEvents="none"
      className="absolute inset-0 items-center justify-center bg-black/50"
    >
      <Confetti />
      <View className="flex-row items-end gap-1">
        <CheerChar delay={0} width={78} plain={usedCount >= 1} />
        <CheerChar delay={120} width={104} plain={usedCount >= 2} />
        <CheerChar delay={240} width={78} plain={usedCount >= 3} />
      </View>
    </Animated.View>
  );
}
