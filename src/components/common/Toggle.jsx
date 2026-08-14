import { Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

// 온/오프 스위치 (웹 Toggle 포팅) — RN Pressable + Reanimated 슬라이드.
export default function Toggle({ checked, onChange, label }) {
  const knob = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(checked ? 20 : 0, { duration: 160 }) }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
      onPress={() => onChange(!checked)}
      className={`h-[26px] w-[46px] justify-center rounded-full px-[3px] ${checked ? 'bg-primary' : 'bg-line'}`}
    >
      <Animated.View className="h-5 w-5 rounded-full bg-white" style={[{ elevation: 2 }, knob]} />
    </Pressable>
  );
}
