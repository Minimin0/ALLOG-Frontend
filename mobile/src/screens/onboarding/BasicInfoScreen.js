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
import Svg, { Line, Path, Rect } from "react-native-svg";
import OnboardingShell from "../../components/OnboardingShell";
import { useAppState } from "../../state/AppState";
export default function BasicInfoScreen({ navigation }) {
  const { nickname, setNickname, setBirth } = useAppState();
  const [form, setForm] = useState({
    nickname,
    gender: "여성",
    birth: "",
    height: "",
    weight: "",
  });
  const [dateOpen, setDateOpen] = useState(false);
  const set = (k, v) => setForm((x) => ({ ...x, [k]: v }));
  const heightNum = Number(form.height);
  const weightNum = Number(form.weight);
  const heightError = form.height && (heightNum < 120 || heightNum > 250);
  const weightError = form.weight && (weightNum < 30 || weightNum > 120);
  const valid =
    form.nickname.trim() &&
    form.birth &&
    form.height &&
    form.weight &&
    !heightError &&
    !weightError;
  return (
    <OnboardingShell
      step={1}
      title="기본 정보를 입력해주세요."
      subtitle="입력하신 정보로 맞춤 루틴을 추천해드려요."
      onBack={() => navigation.goBack()}
      onNext={() => {
        setNickname(form.nickname);
        setBirth(form.birth);
        navigation.navigate("Habits");
      }}
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
        <View style={s.dateField}>
          {Platform.OS === "web" ? (
            <TextInput
              value={form.birth}
              onChangeText={(v) => set("birth", v)}
              placeholder="YYYY-MM-DD"
              style={s.dateInput}
            />
          ) : (
            <Pressable style={s.dateValue} onPress={() => setDateOpen(true)}>
              <Text style={[s.dateText, !form.birth && s.placeholder]}>
                {form.birth || "YYYY-MM-DD"}
              </Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="생년월일 달력 열기"
            hitSlop={8}
            style={s.calendarButton}
            onPress={() => setDateOpen(true)}
          >
            <CalendarIcon />
          </Pressable>
        </View>
        {dateOpen && Platform.OS !== "web" ? (
          <DateTimePicker
            value={
              form.birth
                ? new Date(`${form.birth}T00:00:00`)
                : new Date(2000, 0, 1)
            }
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "calendar"}
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
          <View style={[s.measureInput, heightError && s.measureInputError]}>
            <TextInput
              value={form.height}
              onChangeText={(v) => set("height", v.replace(/\D/g, "").slice(0, 3))}
              placeholder="165"
              placeholderTextColor="#a2a2a2"
              keyboardType="number-pad"
              style={s.measureNumber}
            />
            <Text style={s.measureUnit}>cm</Text>
          </View>
          {heightError ? (
            <Text style={s.fieldError}>정확히 입력해주세요</Text>
          ) : null}
        </Field>
        <Field label="몸무게" half>
          <View style={[s.measureInput, weightError && s.measureInputError]}>
            <TextInput
              value={form.weight}
              onChangeText={(v) => set("weight", v.replace(/\D/g, "").slice(0, 3))}
              placeholder="50"
              placeholderTextColor="#a2a2a2"
              keyboardType="number-pad"
              style={s.measureNumber}
            />
            <Text style={s.measureUnit}>kg</Text>
          </View>
          {weightError ? (
            <Text style={s.fieldError}>정확히 입력해주세요</Text>
          ) : null}
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
function CalendarIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Rect
        x={2}
        y={3.5}
        width={16}
        height={14.5}
        rx={3}
        fill="none"
        stroke="#14453a"
        strokeWidth={1.7}
      />
      <Line x1={2} y1={8} x2={18} y2={8} stroke="#14453a" strokeWidth={1.7} />
      <Path
        d="M6 2 L6 5 M14 2 L14 5"
        stroke="#14453a"
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
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
  dateField: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  dateInput: { flex: 1, height: "100%", paddingHorizontal: 14, fontSize: 13 },
  dateValue: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  calendarButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: { color: "#8a8a8a" },
  measureInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#d9d9d9",
    backgroundColor: "#fff",
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  measureNumber: {
    flex: 1,
    height: "100%",
    padding: 0,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
  },
  measureUnit: {
    width: 24,
    marginLeft: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
  },
  measureInputError: { borderColor: "#d9573b" },
  fieldError: { marginTop: 6, fontSize: 11, fontWeight: "600", color: "#d9573b" },
  row: { flexDirection: "row", gap: 10 },
  choice: {
    flex: 1,
    minHeight: 54,
    borderWidth: 2,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  active: {
    borderColor: "#14453a",
    backgroundColor: "#eaf4ec",
  },
  choiceText: { fontSize: 14, fontWeight: "700" },
  center: { textAlign: "center" },
});
