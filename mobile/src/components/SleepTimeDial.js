import { useEffect, useMemo, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const TICK_GAP = 28;

export default function SleepTimeDial({
  value,
  onChange,
  min = 4,
  max = 10,
  step = 0.5,
}) {
  const scrollRef = useRef(null);
  const { width } = useWindowDimensions();
  const availableWidth = Math.min(width, 390) - 42;
  const edge = Math.max(0, availableWidth / 2 - TICK_GAP / 2);
  const ticks = useMemo(() => {
    const values = [];
    const count = Math.round((max - min) / step);
    for (let i = 0; i <= count; i += 1)
      values.push(Math.round((min + i * step) * 100) / 100);
    return values;
  }, [max, min, step]);

  useEffect(() => {
    const index = ticks.findIndex((tick) => Math.abs(tick - value) < 0.001);
    if (index >= 0)
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ x: index * TICK_GAP, animated: false }),
      );
  }, [ticks, value]);

  const commit = (offset) => {
    const index = Math.max(
      0,
      Math.min(ticks.length - 1, Math.round(offset / TICK_GAP)),
    );
    const next = ticks[index];
    scrollRef.current?.scrollTo({ x: index * TICK_GAP, animated: true });
    if (next !== value) onChange(next);
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={TICK_GAP}
      decelerationRate="fast"
      onMomentumScrollEnd={(event) => commit(event.nativeEvent.contentOffset.x)}
      onScrollEndDrag={(event) => {
        if (Math.abs(event.nativeEvent.velocity?.x || 0) < 0.05)
          commit(event.nativeEvent.contentOffset.x);
      }}
      contentContainerStyle={{ paddingHorizontal: edge }}
    >
      {ticks.map((tick) => {
        const selected = Math.abs(tick - value) < 0.001;
        const hour = Number.isInteger(tick);
        return (
          <View key={tick} style={s.tick}>
            <View style={s.tickArea}>
              <View style={[s.line, hour && s.hour, selected && s.selected]} />
            </View>
            <Text style={[s.label, !hour && s.hidden]}>{Math.floor(tick)}</Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  tick: { width: TICK_GAP, alignItems: "center" },
  tickArea: {
    height: 54,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  line: { width: 3, height: 20, borderRadius: 9, backgroundColor: "#bababa" },
  hour: { height: 37 },
  selected: { width: 4, height: 54, backgroundColor: "#14453a" },
  label: { marginTop: 8, fontSize: 13, fontWeight: "500", color: "#bababa" },
  hidden: { opacity: 0 },
});
