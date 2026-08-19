import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';

// 응원 폭죽 (웹 burst 키프레임 → Reanimated). 중심에서 사방으로 퍼지며 회전하고,
// 중력에 끌려 떨어지다 사라진다 — 실제 색종이 컨페티처럼 얇은 조각/작은 원 혼합.
const COLORS = ['#14453a', '#c08a24', '#c0492f', '#3ddc84', '#eaf4ec', '#4a7c6f'];
const COUNT = 32;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

// 파티클마다 한 번만 계산되는 랜덤 궤적 (버스트 각도/거리/회전/낙하량/딜레이/모양).
function useParticleSeed(index) {
  return useMemo(() => {
    const isStrip = Math.random() > 0.45;
    const width = isStrip ? randomBetween(5, 8) : randomBetween(7, 10);
    return {
      angle: randomBetween(0, Math.PI * 2),
      dist: randomBetween(70, 170),
      spin: randomBetween(-540, 540),
      fall: randomBetween(60, 140),
      delay: randomBetween(0, 140),
      width,
      height: isStrip ? randomBetween(11, 16) : width,
      color: COLORS[index % COLORS.length],
    };
  }, [index]);
}

function Particle({ index }) {
  const p = useSharedValue(0);
  const seed = useParticleSeed(index);

  useEffect(() => {
    p.value = withDelay(seed.delay, withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) }));
  }, []);

  const style = useAnimatedStyle(() => {
    const burst = Math.min(p.value / 0.4, 1); // 초반 40% 구간에 바깥으로 퍼짐
    const gravity = p.value * p.value; // 뒤로 갈수록 중력 가속
    return {
      opacity: p.value < 0.75 ? 1 : 1 - (p.value - 0.75) / 0.25,
      transform: [
        { translateX: Math.cos(seed.angle) * seed.dist * burst },
        { translateY: Math.sin(seed.angle) * seed.dist * burst + gravity * seed.fall },
        { rotate: `${seed.spin * p.value}deg` },
        { scale: 1 - p.value * 0.15 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        { position: 'absolute', width: seed.width, height: seed.height, borderRadius: 1.5, backgroundColor: seed.color },
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
