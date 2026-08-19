import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

import { colors } from '@/theme';

// 응원 폭죽 (웹 burst 키프레임 → Reanimated). 가운데에서 사방으로 퍼지며 사라짐.
// '#3ddc84'는 폭죽에만 쓰는 밝은 초록 악센트라 토큰으로 올리지 않았다.
const COLORS = [colors.primary, colors.reward, colors.danger, '#3ddc84', colors.primaryPale];
const COUNT = 24;

function Particle({ index }) {
  const p = useSharedValue(0);
  const angle = (index / COUNT) * Math.PI * 2;
  const dist = 110 + (index % 5) * 24;
  useEffect(() => {
    p.value = withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) });
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - p.value,
    transform: [
      { translateX: Math.cos(angle) * dist * p.value },
      { translateY: Math.sin(angle) * dist * p.value },
      { scale: 1 - p.value * 0.4 },
    ],
  }));
  return (
    <Animated.View
      style={[
        { position: 'absolute', width: 10, height: 10, borderRadius: 2, backgroundColor: COLORS[index % COLORS.length] },
        style,
      ]}
    />
  );
}

export default function Confetti() {
  return (
    <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
      <View>
        {Array.from({ length: COUNT }).map((_, i) => (
          <Particle key={i} index={i} />
        ))}
      </View>
    </View>
  );
}
