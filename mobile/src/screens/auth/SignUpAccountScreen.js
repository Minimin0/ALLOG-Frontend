import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import DesignScreen from "../../components/DesignScreen";
export default function SignUpAccountScreen({ navigation }) {
  const [user, setUser] = useState(""),
    [pw, setPw] = useState(""),
    [confirm, setConfirm] = useState("");
  const match = pw === confirm;
  const userError = user.length > 0 && (user.length < 4 || user.length > 13);
  const pwError = pw.length > 0 && (pw.length < 10 || pw.length > 12);
  const mismatch = confirm.length > 0 && !match;
  const showCheck = confirm.length > 0 && match;
  const valid =
    user.trim() &&
    pw.trim() &&
    confirm.trim() &&
    match &&
    !userError &&
    !pwError;
  return (
    <DesignScreen>
      <View style={s.body}>
        <Text style={s.title}>아이디와 비밀번호를{`\n`}입력해 주세요.</Text>

        <Text style={s.label}>아이디</Text>
        <TextInput
          value={user}
          onChangeText={setUser}
          placeholder="아이디 (4~13자리 이내의 영어 대소문자 포함)"
          placeholderTextColor="#bababa"
          autoCapitalize="none"
          style={[s.input, userError && s.inputError]}
        />
        {userError ? (
          <Text style={s.error}>아이디는 4~13자로 입력해주세요</Text>
        ) : null}

        <Text style={[s.label, { marginTop: 18 }]}>비밀번호</Text>
        <TextInput
          value={pw}
          onChangeText={setPw}
          secureTextEntry
          placeholder="비밀번호 (10~12자리 이내의 영어 대소문자, 숫자 포함)"
          placeholderTextColor="#bababa"
          style={[s.input, (pwError || mismatch) && s.inputError]}
        />
        {pwError ? (
          <Text style={s.error}>비밀번호는 10~12자로 입력해주세요</Text>
        ) : null}

        <View style={{ marginTop: 10 }}>
          <View style={[s.confirmRow, mismatch && s.inputError]}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholder="비밀번호 확인"
              placeholderTextColor="#bababa"
              style={s.confirmInput}
            />
            {showCheck ? <Text style={s.check}>✓</Text> : null}
          </View>
          {mismatch ? (
            <Text style={s.error}>비밀번호가 일치하지 않아요.</Text>
          ) : null}
        </View>
      </View>

      <Pressable
        disabled={!valid}
        onPress={() => navigation.navigate("BasicInfo")}
        style={[s.next, !valid && { backgroundColor: "#bababa" }]}
      >
        <Text style={s.nextText}>완료</Text>
      </Pressable>
    </DesignScreen>
  );
}
const s = StyleSheet.create({
  body: { position: "absolute", left: 26, right: 24, top: 118 },
  title: { fontSize: 25, lineHeight: 32.5, fontWeight: "700" },
  label: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 35,
    color: "#4a4a4a",
    marginTop: 24,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    borderRadius: 15,
    backgroundColor: "#fefefe",
    paddingHorizontal: 16,
    paddingVertical: 0,
    textAlignVertical: "center",
    fontFamily: "Pretendard",
    fontSize: 13,
    fontWeight: "600",
    color: "#4a4a4a",
  },
  inputError: { borderColor: "#d9573b" },
  confirmRow: {
    height: 44,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    borderRadius: 15,
    backgroundColor: "#fefefe",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  confirmInput: {
    flex: 1,
    height: "100%",
    paddingVertical: 0,
    textAlignVertical: "center",
    fontFamily: "Pretendard",
    fontSize: 13,
    fontWeight: "600",
    color: "#4a4a4a",
  },
  check: { color: "#14453a", fontSize: 18, fontWeight: "700" },
  error: { marginTop: 6, fontSize: 11, fontWeight: "600", color: "#d9573b" },
  next: {
    position: "absolute",
    left: 31,
    bottom: 52,
    width: 338,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: { color: "#f2f2f6", fontSize: 18, fontWeight: "700" },
});
