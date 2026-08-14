import { useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

// 수면 시간 다이얼 (웹 SleepTimeDial 포팅) — 가로 스크롤 눈금 + 스냅.
const TICK_GAP = 28;

function buildTicks(min, max, step) {
  const ticks = [];
  const count = Math.round((max - min) / step);
  for (let i = 0; i <= count; i += 1) ticks.push(Math.round((min + i * step) * 100) / 100);
  return ticks;
}

export default function SleepTimeDial({ value, onChange, min = 4, max = 10, step = 0.5 }) {
  const ticks = buildTicks(min, max, step);
  const scrollRef = useRef(null);
  const [trackW, setTrackW] = useState(0);
  const pad = trackW > 0 ? (trackW - TICK_GAP) / 2 : 0;

  // 스크롤이 멈추면 가장 가까운 눈금으로 스냅 + 값 반영.
  const handleEnd = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const idx = Math.max(0, Math.min(ticks.length - 1, Math.round(x / TICK_GAP)));
    const next = ticks[idx];
    scrollRef.current?.scrollTo({ x: idx * TICK_GAP, animated: true });
    if (next !== value) onChange(next);
  };

  return (
    <View className="w-full" onLayout={(e) => setTrackW(e.nativeEvent.layout.width)}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={TICK_GAP}
        decelerationRate="fast"
        onMomentumScrollEnd={handleEnd}
        onScrollEndDrag={handleEnd}
        contentContainerStyle={{ paddingHorizontal: pad }}
      >
        {ticks.map((tick) => {
          const selected = Math.abs(tick - value) < 1e-6;
          const isHour = Number.isInteger(tick);
          return (
            <View key={tick} style={{ width: TICK_GAP }} className="items-center">
              <View className="h-[54px] w-full items-center justify-end">
                <View
                  className={`rounded-full ${selected ? 'bg-primary' : 'bg-disabled'}`}
                  style={{ width: selected ? 4 : 3, height: selected ? 54 : isHour ? 37 : 20 }}
                />
              </View>
              <Text className="mt-2 text-[13px] font-medium text-disabled" style={{ opacity: isHour ? 1 : 0 }}>
                {Math.floor(tick)}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
