import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import OnboardingShell from "../../components/OnboardingShell";
import SleepTimeDial from "../../components/SleepTimeDial";
import { useAppState } from "../../state/AppState";
export default function LifestyleScreen({ navigation }) {
  const { setLifestyle } = useAppState();
  const [form, setForm] = useState({
    sleep: 6.5,
    exercise: null,
    meal: null,
    period: null,
  });
  const set = (k, v) => setForm((x) => ({ ...x, [k]: v }));
  return (
    <OnboardingShell
      step={4}
      title="생활 패턴을 알려주세요"
      subtitle="AI가 최적의 그룹과 루틴 시간을 추천해 드려요."
      onBack={() => navigation.goBack()}
      onNext={() => {
        setLifestyle(form);
        navigation.navigate("OnboardingComplete");
      }}
      canNext={form.exercise && form.meal && form.period}
    >
      <View style={s.lifestyleForm}>
        <View style={s.section}>
          <Text style={s.heading}>수면 시간</Text>
          <View style={s.sleep}>
            <Text style={s.big}>{Math.floor(form.sleep)}</Text>
            <Text style={s.unit}>시간</Text>
            <Text style={s.big}>{form.sleep % 1 ? "30" : "00"}</Text>
            <Text style={s.unit}>분</Text>
            <View style={s.dial}>
              <SleepTimeDial
                value={form.sleep}
                onChange={(sleep) => set("sleep", sleep)}
                min={0}
                max={24}
              />
            </View>
          </View>
        </View>
        <Option
          title="운동 빈도"
          values={[
            "주 1회",
            "주 2회",
            "주 3회",
            "주 4회",
            "주 5회",
            "거의 안함",
          ]}
          value={form.exercise}
          set={(v) => set("exercise", v)}
          cols={3}
        />
        <Option
          title="식사 빈도"
          values={["먹지 않음", "1회", "2회", "3회 이상"]}
          value={form.meal}
          set={(v) => set("meal", v)}
          cols={2}
        />
        <Option
          title="선호 기간"
          values={["7일", "14일", "30일"]}
          value={form.period}
          set={(v) => set("period", v)}
          cols={3}
        />
      </View>
    </OnboardingShell>
  );
}
function Option({ title, values, value, set, cols }) {
  return (
    <View style={s.section}>
      <Text style={s.heading}>{title}</Text>
      <View style={s.options}>
        {values.map((x) => (
          <Pressable
            key={x}
            onPress={() => set(x)}
            style={[
              s.choice,
              { width: cols === 3 ? "30.8%" : "48%" },
              value === x && s.active,
            ]}
          >
            <Text style={s.choiceText}>{x}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  lifestyleForm: { gap: 24 },
  heading: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 0,
  },
  sleep: {
    height: 191,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    borderRadius: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingTop: 24,
    gap: 6,
  },
  big: { fontSize: 33, fontWeight: "700" },
  unit: { fontSize: 13, color: "#696973", marginTop: 18, marginRight: 10 },
  dial: {
    position: "absolute",
    bottom: 18,
    left: 1,
    right: 1,
    height: 92,
  },
  section: { gap: 12 },
  options: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  choice: {
    height: 54,
    borderWidth: 2,
    borderColor: "#e7e3d8",
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  active: {
    borderColor: "#14453a",
    backgroundColor: "#eaf4ec",
  },
  choiceText: { fontSize: 13, fontWeight: "700" },
});
