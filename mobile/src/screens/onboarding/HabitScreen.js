import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingShell from "../../components/OnboardingShell";
import Care from "../../../assets/images/SelfCareIcon.svg";
import Exercise from "../../../assets/images/ExerciseIcon.svg";
import Meal from "../../../assets/images/MealIcon.svg";
import Sleep from "../../../assets/images/SleepIcon.svg";
const items = [
  ["수분케어", "충분한 수분 섭취", Care],
  ["운동", "꾸준한 신체 운동", Exercise],
  ["식사", "균형 잡힌 식단 유지", Meal],
  ["수면", "규칙적인 수면 패턴", Sleep],
];
export default function HabitScreen({ navigation }) {
  const [selected, setSelected] = useState([]);
  const toggle = (x) =>
    setSelected((v) => (v.includes(x) ? v.filter((i) => i !== x) : [...v, x]));
  return (
    <OnboardingShell
      step={2}
      title="어떤 루틴을 개선하고 싶나요?"
      subtitle="여러 개를 선택할 수 있어요. AI가 맞춤 그룹을 추천해드립니다."
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("CoachStyle")}
      canNext={selected.length > 0}
    >
      <View style={s.grid}>
        {items.map(([name, sub, Icon]) => {
          const active = selected.includes(name);
          return (
            <HabitCard
              key={name}
              name={name}
              sub={sub}
              Icon={Icon}
              active={active}
              onPress={() => toggle(name)}
            />
          );
        })}
      </View>
    </OnboardingShell>
  );
}
function HabitCard({ name, sub, Icon, active, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const animate = (toValue) => {
    Animated.spring(scale, {
      toValue,
      speed: 32,
      bounciness: toValue === 1 ? 5 : 0,
      useNativeDriver: true,
    }).start();
  };
  // 선택되는 순간에만 아이콘이 한 번 살짝 커졌다 돌아옴.
  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.22,
          duration: 120,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active]);
  const iconSize = name === "운동" ? 34 : 24;
  return (
    <Animated.View style={[s.cardWrap, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animate(0.92)}
        onPressOut={() => animate(1)}
        style={[s.card, active && s.active]}
      >
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Icon width={iconSize} height={iconSize} />
        </Animated.View>
        <Text style={s.name}>{name}</Text>
        <Text style={s.sub}>{sub}</Text>
      </Pressable>
    </Animated.View>
  );
}
const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  cardWrap: { width: "48%" },
  card: {
    width: "100%",
    minHeight: 98,
    borderWidth: 2,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 4,
  },
  active: {
    borderColor: "#14453a",
    backgroundColor: "#eaf4ec",
  },
  name: { fontSize: 15, fontWeight: "700" },
  sub: { fontSize: 10, fontWeight: "500", color: "#4a4a4a" },
});
