import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

import { colors } from '@/theme';

// 게이지 채움 바: 마운트 시 0 → percent%로 차오름.
export default function AnimatedGauge({ percent, color = colors.primary, height = 9 }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withTiming(percent, { duration: 800, easing: Easing.out(Easing.cubic) });
  }, [percent]);
  const style = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return <Animated.View style={[{ height, borderRadius: 999, backgroundColor: color }, style]} />;
}
