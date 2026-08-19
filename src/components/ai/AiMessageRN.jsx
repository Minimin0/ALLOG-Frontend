import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import Animated, { FadeIn, FadeInUp, FadeInDown, useSharedValue, useAnimatedStyle, useAnimatedProps, withDelay, withTiming, Easing } from 'react-native-reanimated';

import Mascot from '@/components/common/Mascot';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// AI 코치 메시지 + 데이터 시각화 (웹 AiMessage 포팅). viz: pips/ring/columns/versus.
// 애니메이션(막대 차오름 등)은 최종 상태로 렌더(등장 애니는 상위에서 Reanimated로).

// 점: 마운트 시 하나씩 순서대로 페이드인 (막대 차오름과 같은 stagger 리듬).
function VizPips({ filled, total, note }) {
  return (
    <View className="mt-3">
      <View className="flex-row flex-wrap gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <Animated.View
            key={i}
            entering={FadeIn.delay(i * 90).duration(280).easing(Easing.out(Easing.cubic))}
            className={`h-6 w-6 rounded-full ${i < filled ? 'bg-primary' : 'border-2 border-line'}`}
          />
        ))}
      </View>
      {note ? <Text className="mt-2 text-[11px] font-bold text-primary">{note}</Text> : null}
    </View>
  );
}

function VizRing({ value, goal, unit, note }) {
  const size = 84;
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, []);
  const ringProps = useAnimatedProps(() => ({
    strokeDashoffset: circ - (circ - offset) * progress.value,
  }));
  return (
    <View className="mt-3 flex-row items-center gap-4">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={42} cy={42} r={r} stroke="#e7e3d8" strokeWidth={9} fill="none" />
          <AnimatedCircle
            cx={42}
            cy={42}
            r={r}
            stroke="#14453a"
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            animatedProps={ringProps}
          />
          <Line x1={42} y1={4} x2={42} y2={12} stroke="#c08a24" strokeWidth={3} strokeLinecap="round" transform={`rotate(${goal * 3.6} 42 42)`} />
        </Svg>
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-[17px] font-bold text-primary">{value}{unit}</Text>
        </View>
      </View>
      <View>
        <Text className="text-[11px] text-muted">목표 {goal}{unit}</Text>
        {note ? <Text className="text-[11px] font-bold text-reward">{note}</Text> : null}
      </View>
    </View>
  );
}

// 막대: 마운트 시 0 → 목표 높이로 차오름 (stagger).
function GrowBar({ targetH, highlight, index }) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(index * 120, withTiming(targetH, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, [targetH]);
  const style = useAnimatedStyle(() => ({ height: h.value }));
  return (
    <Animated.View
      style={[{ width: 28, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: highlight ? '#14453a' : '#bababa' }, style]}
    />
  );
}

function VizColumns({ data, unit }) {
  const max = Math.max(...data.map((d) => d.value));
  const H = 64;
  return (
    <View className="mt-3 w-full flex-row items-end justify-center gap-7" style={{ height: H + 44 }}>
      {data.map((d, i) => (
        <View key={d.label} className="items-center gap-1.5">
          <Text className={`text-[11px] font-bold ${d.highlight ? 'text-primary' : 'text-muted'}`}>{d.value}{unit}</Text>
          <GrowBar targetH={(d.value / max) * H} highlight={d.highlight} index={i} />
          <Text className={`text-[11px] ${d.highlight ? 'font-bold text-primary' : 'text-muted'}`}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

function VizVersus({ left, right, delta, metric, unit }) {
  // 증가(+)는 아래→위로 떠오르며, 감소(−/-)는 위→아래로 내려가며 첫 등장 시 한 번만 애니메이션.
  const isDecrease = /^[-−]/.test(delta ?? '');
  const DeltaEntering = isDecrease ? FadeInDown : FadeInUp;
  const Card = ({ item, me }) => (
    <View className={`flex-1 items-center rounded-item px-2 py-2.5 ${me ? 'bg-primary-tint' : 'bg-surface-alt'}`} style={me ? { borderWidth: 1.5, borderColor: '#14453a' } : undefined}>
      <Text className={`text-[22px] font-bold ${me ? 'text-primary' : 'text-muted'}`}>{item.value}<Text className="text-[11px] font-bold">{unit}</Text></Text>
      <Text className={`text-[11px] ${me ? 'text-primary' : 'text-muted'}`}>{item.label}</Text>
    </View>
  );
  return (
    <View className="mt-3">
      {metric ? <Text className="mb-1.5 text-[11px] text-muted">기준 · {metric}</Text> : null}
      <View className="flex-row items-center gap-2.5">
        <Card item={left} me={false} />
        <Animated.Text
          entering={DeltaEntering.duration(450).easing(Easing.out(Easing.cubic))}
          className="text-[11px] font-bold text-reward"
        >
          {delta}
        </Animated.Text>
        <Card item={right} me />
      </View>
    </View>
  );
}

function CoachViz({ viz }) {
  switch (viz.type) {
    case 'pips':
      return <VizPips filled={viz.filled} total={viz.total} note={viz.note} />;
    case 'ring':
      return <VizRing value={viz.value} goal={viz.goal} unit={viz.unit} note={viz.note} />;
    case 'columns':
      return <VizColumns data={viz.data} unit={viz.unit} />;
    case 'versus':
      return <VizVersus left={viz.left} right={viz.right} delta={viz.delta} metric={viz.metric} unit={viz.unit} />;
    default:
      return null;
  }
}

export default function AiMessageRN({ text, viz }) {
  const wide = viz?.type === 'columns';
  return (
    <View className="flex-row items-start gap-2">
      <View className="h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary-tint" style={{ borderWidth: 1, borderColor: '#e7e3d8' }}>
        <Mascot size={30} />
      </View>
      <View className={`rounded-2xl bg-primary-tint px-4 py-3 ${wide ? 'flex-1' : 'max-w-[80%]'}`}>
        <Text className="text-[15px] leading-6 text-ink">{text}</Text>
        {viz ? <CoachViz viz={viz} /> : null}
      </View>
    </View>
  );
}
