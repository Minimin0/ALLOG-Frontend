import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import DesignScreen from "../../components/DesignScreen";
import { colors } from "../../theme";
export default function SignUpAccountScreen({ navigation }) {
  const [user, setUser] = useState(""),
    [pw, setPw] = useState(""),
    [confirm, setConfirm] = useState("");
  const match = pw === confirm,
    valid = user.trim() && pw.trim() && confirm.trim() && match;
  return (
    <DesignScreen>
      <Text style={s.title}>아이디와 비밀번호를{`\n`}입력해 주세요.</Text>
      <Text style={[s.label, { top: 209 }]}>아이디</Text>
      <TextInput
        value={user}
        onChangeText={setUser}
        placeholder="아이디 (4~13자리 이내)"
        placeholderTextColor={colors.disabled}
        style={[s.input, { top: 238 }]}
      />
      <Text style={[s.label, { top: 303 }]}>비밀번호</Text>
      <TextInput
        value={pw}
        onChangeText={setPw}
        secureTextEntry
        placeholder="비밀번호 (10~12자리 이내)"
        placeholderTextColor={colors.disabled}
        style={[s.input, { top: 334 }]}
      />
      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholder="비밀번호 확인"
        placeholderTextColor={colors.disabled}
        style={[s.input, { top: 382 }]}
      />
      {confirm && match ? <Text style={s.check}>✓</Text> : null}
      {confirm && !match ? (
        <Text style={s.error}>비밀번호가 일치하지 않아요.</Text>
      ) : null}
      <Pressable
        disabled={!valid}
        onPress={() => navigation.navigate("BasicInfo")}
        style={[s.next, !valid && { backgroundColor: colors.disabled }]}
      >
        <Text style={s.nextText}>완료</Text>
      </Pressable>
    </DesignScreen>
  );
}
const s = StyleSheet.create({
  title: {
    position: "absolute",
    left: 26,
    top: 118,
    width: 310,
    fontSize: 25,
    lineHeight: 32.5,
    fontWeight: "700",
  },
  label: {
    position: "absolute",
    left: 30,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 35,
    color: colors.subtle,
  },
  input: {
    position: "absolute",
    left: 26,
    width: 343,
    height: 44,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 15,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  check: {
    position: "absolute",
    right: 42,
    top: 394,
    color: colors.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  error: {
    position: "absolute",
    left: 26,
    top: 429,
    fontSize: 11,
    fontWeight: "600",
    color: colors.heart,
  },
  next: {
    position: "absolute",
    left: 31,
    top: 776,
    width: 338,
    height: 50,
    borderRadius: 20,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: { color: "#f2f2f6", fontSize: 18, fontWeight: "700" },
});
