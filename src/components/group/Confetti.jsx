import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';

// 응원 폭죽 (웹 burst 키프레임 → Reanimated). 가운데에서 사방으로 퍼지며 사라짐.
const COLORS = ['#14453a', '#c08a24', '#c0492f', '#3ddc84', '#eaf4ec'];
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
