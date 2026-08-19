import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingShell from "../../components/OnboardingShell";
import { useAppState } from "../../state/AppState";
import { COACH_IMAGES } from "../../utils/coach";
import { colors } from "../../theme";
const items = [
  ["응원형", "따뜻하게 격려해드려요", COACH_IMAGES["응원형"]],
  ["압박형", "긴장감 있게 자극할게요", COACH_IMAGES["압박형"]],
  ["팩트형", "숫자와 근거로 말할게요", COACH_IMAGES["팩트형"]],
  ["유머형", "가볍고 재밌게 말할게요", COACH_IMAGES["유머형"]],
];
export default function CoachStyleScreen({ navigation }) {
  const { coachStyle, setCoachStyle } = useAppState();
  const [selected, setSelected] = useState(coachStyle);
  return (
    <OnboardingShell
      step={3}
      title="어떤 방식으로 응원받고 싶나요?"
      subtitle="선택한 스타일로 AI 코치가 매일 말을 걸어드려요."
      onBack={() => navigation.goBack()}
      onNext={() => {
        setCoachStyle(selected);
        navigation.navigate("Lifestyle");
      }}
    >
      <View style={s.grid}>
        {items.map(([name, tone, image]) => (
          <Pressable
            key={name}
            onPress={() => setSelected(name)}
            style={[s.card, selected === name && s.active]}
          >
            <Image source={image} style={s.coachImage} resizeMode="contain" />
            <Text style={s.name}>{name}</Text>
            <Text style={s.tone}>{tone}</Text>
          </Pressable>
        ))}
      </View>
    </OnboardingShell>
  );
}
const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    height: 160,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  active: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
  name: { fontSize: 15, fontWeight: "700", marginTop: 8 },
  tone: { fontSize: 10, fontWeight: "500", color: colors.subtle, marginTop: 4 },
  coachImage: { width: 80, height: 80 },
});
