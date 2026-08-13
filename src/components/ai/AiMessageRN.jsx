import { View, Text } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';

// AI 코치 메시지 + 데이터 시각화 (웹 AiMessage 포팅). viz: pips/ring/columns/versus.
// 애니메이션(막대 차오름 등)은 최종 상태로 렌더(등장 애니는 상위에서 Reanimated로).

function VizPips({ filled, total, note }) {
  return (
    <View className="mt-3">
      <View className="flex-row flex-wrap gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} className={`h-6 w-6 rounded-full ${i < filled ? 'bg-primary' : 'border-2 border-line'}`} />
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
  return (
    <View className="mt-3 flex-row items-center gap-4">
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={42} cy={42} r={r} stroke="#e7e3d8" strokeWidth={9} fill="none" />
          <Circle
            cx={42}
            cy={42}
            r={r}
            stroke="#14453a"
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
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

function VizColumns({ data, unit }) {
  const max = Math.max(...data.map((d) => d.value));
  const H = 64;
  return (
    <View className="mt-3 w-full flex-row items-end justify-center gap-7" style={{ height: H + 44 }}>
      {data.map((d) => (
        <View key={d.label} className="items-center gap-1.5">
          <Text className={`text-[11px] font-bold ${d.highlight ? 'text-primary' : 'text-muted'}`}>{d.value}{unit}</Text>
          <View className={`w-7 rounded-t ${d.highlight ? 'bg-primary' : 'bg-disabled'}`} style={{ height: (d.value / max) * H }} />
          <Text className={`text-[11px] ${d.highlight ? 'font-bold text-primary' : 'text-muted'}`}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

function VizVersus({ left, right, delta, metric, unit }) {
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
        <Text className="text-[11px] font-bold text-reward">{delta}</Text>
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
      <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-tint" style={{ borderWidth: 1, borderColor: '#e7e3d8' }}>
        <Text className="text-lg">🌱</Text>
      </View>
      <View className={`rounded-2xl bg-primary-tint px-4 py-3 ${wide ? 'flex-1' : 'max-w-[80%]'}`}>
        <Text className="text-[15px] leading-6 text-ink">{text}</Text>
        {viz ? <CoachViz viz={viz} /> : null}
      </View>
    </View>
  );
}
