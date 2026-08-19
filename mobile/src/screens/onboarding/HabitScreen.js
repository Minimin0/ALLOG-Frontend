import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingShell from "../../components/OnboardingShell";
import Care from "../../../assets/images/SelfCareIcon.svg";
import Exercise from "../../../assets/images/ExerciseIcon.svg";
import Meal from "../../../assets/images/MealIcon.svg";
import Sleep from "../../../assets/images/SleepIcon.svg";
import { colors } from "../../theme";
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
            <Pressable
              key={name}
              onPress={() => toggle(name)}
              style={({ pressed }) => [s.card, active && s.active, pressed && s.pressed]}
            >
              <Icon width={24} height={24} />
              <Text style={s.name}>{name}</Text>
              <Text style={s.sub}>{sub}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingShell>
  );
}
const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    minHeight: 98,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    gap: 4,
  },
  active: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  name: { fontSize: 15, fontWeight: "700" },
  sub: { fontSize: 10, fontWeight: "500", color: colors.subtle },
});
