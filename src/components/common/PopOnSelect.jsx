import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing } from 'react-native-reanimated';

// 선택됐을 때 한 번만 살짝 커졌다 돌아오는 연출 (온보딩 카드 아이콘/캐릭터용).
// active가 true로 바뀌는 순간에만 재생 — 해제될 땐 조용히.
export default function PopOnSelect({ active, children }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(
        withTiming(1.22, { duration: 120, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 160, easing: Easing.out(Easing.quad) }),
      );
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
