import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import OnboardingShell from "../../components/OnboardingShell";
export default function BasicInfoScreen({ navigation }) {
  const [form, setForm] = useState({
    nickname: "",
    gender: "여성",
    birth: "",
    height: "",
    weight: "",
  });
  const [dateOpen, setDateOpen] = useState(false);
  const set = (k, v) => setForm((x) => ({ ...x, [k]: v }));
  const valid =
    form.nickname.trim() && form.birth && form.height && form.weight;
  return (
    <OnboardingShell
      step={1}
      title="기본 정보를 입력해주세요."
      subtitle="입력하신 정보로 맞춤 루틴을 추천해드려요."
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("Habits")}
      nextLabel="다음 단계로"
      canNext={valid}
    >
      <Field label="닉네임">
        <TextInput
          value={form.nickname}
          onChangeText={(v) => set("nickname", v)}
          placeholder="사용하실 닉네임을 입력해주세요."
          style={s.input}
        />
      </Field>
      <Field label="성별">
        <View style={s.row}>
          {["여성", "남성", "선택 안함"].map((x) => (
            <Choice
              key={x}
              text={x}
              active={form.gender === x}
              onPress={() => set("gender", x)}
            />
          ))}
        </View>
      </Field>
      <Field label="생년월일">
        {Platform.OS === "web" ? (
          <TextInput
            value={form.birth}
            onChangeText={(v) => set("birth", v)}
            placeholder="YYYY-MM-DD"
            style={s.input}
          />
        ) : (
          <Pressable style={s.input} onPress={() => setDateOpen(true)}>
            <Text style={[s.dateText, !form.birth && s.placeholder]}>
              {form.birth || "YYYY-MM-DD"}
            </Text>
          </Pressable>
        )}
        {dateOpen && Platform.OS !== "web" ? (
          <DateTimePicker
            value={
              form.birth
                ? new Date(`${form.birth}T00:00:00`)
                : new Date(2000, 0, 1)
            }
            mode="date"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setDateOpen(false);
              if (event.type === "set" && selectedDate) {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(
                  2,
                  "0",
                );
                const day = String(selectedDate.getDate()).padStart(2, "0");
                set("birth", `${year}-${month}-${day}`);
              }
            }}
          />
        ) : null}
      </Field>
      <View style={s.row}>
        <Field label="키" half>
          <TextInput
            value={form.height}
            onChangeText={(v) => set("height", v)}
            placeholder="165          cm"
            keyboardType="number-pad"
            style={[s.input, s.center]}
          />
        </Field>
        <Field label="몸무게" half>
          <TextInput
            value={form.weight}
            onChangeText={(v) => set("weight", v)}
            placeholder="50            kg"
            keyboardType="number-pad"
            style={[s.input, s.center]}
          />
        </Field>
      </View>
    </OnboardingShell>
  );
}
function Field({ label, children, half }) {
  return (
    <View style={[s.field, half && { flex: 1 }]}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  );
}
function Choice({ text, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.choice, active && s.active]}>
      <Text style={s.choiceText}>{text}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: 12, fontWeight: "700", color: "#666" },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 14,
    fontSize: 13,
    justifyContent: "center",
  },
  dateText: { fontSize: 13, color: "#111" },
  placeholder: { color: "#8a8a8a" },
  row: { flexDirection: "row", gap: 10 },
  choice: {
    flex: 1,
    minHeight: 54,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  active: {
    borderWidth: 2,
    borderColor: "#14453a",
    backgroundColor: "#eaf4ec",
  },
  choiceText: { fontSize: 14, fontWeight: "700" },
  center: { textAlign: "center" },
});
