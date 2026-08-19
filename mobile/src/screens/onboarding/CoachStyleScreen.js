import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingShell from "../../components/OnboardingShell";
import { useAppState } from "../../state/AppState";
import { COACH_IMAGES } from "../../utils/coach";
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
          <CoachCard
            key={name}
            name={name}
            tone={tone}
            image={image}
            active={selected === name}
            onPress={() => setSelected(name)}
          />
        ))}
      </View>
    </OnboardingShell>
  );
}
function CoachCard({ name, tone, image, active, onPress }) {
  const imgScale = useRef(new Animated.Value(1)).current;
  // 선택되는 순간에만 캐릭터가 한 번 살짝 커졌다 돌아옴.
  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.timing(imgScale, {
          toValue: 1.18,
          duration: 130,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(imgScale, {
          toValue: 1,
          duration: 170,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active]);
  return (
    <Pressable onPress={onPress} style={[s.card, active && s.active]}>
      <Animated.Image
        source={image}
        style={[s.coachImage, { transform: [{ scale: imgScale }] }]}
        resizeMode="contain"
      />
      <Text style={s.name}>{name}</Text>
      <Text style={s.tone}>{tone}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    width: "48%",
    height: 160,
    borderWidth: 2,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  active: {
    borderColor: "#14453a",
    backgroundColor: "#eaf4ec",
  },
  name: { fontSize: 15, fontWeight: "700", marginTop: 8 },
  tone: { fontSize: 10, fontWeight: "500", color: "#4a4a4a", marginTop: 4 },
  coachImage: { width: 80, height: 80 },
});
