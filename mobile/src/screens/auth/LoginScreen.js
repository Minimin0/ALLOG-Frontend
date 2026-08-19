import { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DesignScreen from "../../components/DesignScreen";
import Naver from "../../../assets/images/Naver.svg";
import Apple from "../../../assets/images/Apple.svg";
import Google from "../../../assets/images/Google.svg";
import Kakao from "../../../assets/images/Kakao.svg";

const socials = [
  ["네이버 로그인", Naver],
  ["Apple 로그인", Apple],
  ["Google 로그인", Google],
  ["카카오 로그인", Kakao],
];
export default function LoginScreen({ navigation }) {
  const [googleError, setGoogleError] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const enterHome = () => {
    Keyboard.dismiss();
    navigation.reset({ index: 0, routes: [{ name: "Home" }] });
  };
  return (
    <DesignScreen>
      <Text style={s.title}>LOGIN</Text>
      <TextInput
        value={userId}
        onChangeText={setUserId}
        style={[s.input, { top: 201 }]}
        placeholder="아이디"
        placeholderTextColor="#bababa"
        autoCapitalize="none"
        returnKeyType="next"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={[s.input, { top: 267, height: 49 }]}
        placeholder="비밀번호"
        placeholderTextColor="#bababa"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={enterHome}
      />
      <Pressable style={s.login} onPress={enterHome}>
        <Text style={s.loginText}>로그인</Text>
      </Pressable>
      <Pressable style={[s.find, { left: 128 }]}>
        <Text style={s.findText}>아이디 찾기</Text>
      </Pressable>
      <Pressable style={[s.find, { left: 211 }]}>
        <Text style={s.findText}>비밀번호 찾기</Text>
      </Pressable>
      <View style={s.signup}>
        <Text style={s.signupText}>계정이 없다면?</Text>
        <Text
          style={s.signupLink}
          onPress={() => navigation.navigate("SignUpPhone")}
        >
          회원가입하기
        </Text>
      </View>
      <View style={s.line} />
      <Text style={s.easy}>간편 로그인</Text>
      <View style={s.socials}>
        {socials.map(([label, Icon]) => (
          <Pressable
            key={label}
            accessibilityLabel={label}
            style={s.social}
            onPress={
              label === "Google 로그인"
                ? () =>
                    setGoogleError(
                      "Firebase 및 Google OAuth 설정값이 필요합니다.",
                    )
                : undefined
            }
          >
            <Icon width={34} height={34} />
          </Pressable>
        ))}
      </View>
      {googleError ? <Text style={s.googleError}>{googleError}</Text> : null}
    </DesignScreen>
  );
}
const s = StyleSheet.create({
  title: {
    position: "absolute",
    left: 129,
    top: 133,
    width: 128,
    textAlign: "center",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 48,
    letterSpacing: -1.6,
  },
  input: {
    position: "absolute",
    left: 49,
    width: 296,
    height: 50,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    fontSize: 15,
    fontWeight: "500",
  },
  login: {
    position: "absolute",
    left: 44,
    top: 346,
    width: 296,
    height: 50,
    borderRadius: 20,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  find: { position: "absolute", top: 401, height: 30 },
  findText: { fontSize: 12.643, fontWeight: "500", lineHeight: 29.5 },
  signup: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 473,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  signupText: { fontSize: 13, fontWeight: "500", color: "#6b7268" },
  signupLink: {
    marginLeft: 6,
    fontSize: 13.5,
    fontWeight: "700",
    color: "#14453a",
  },
  line: {
    position: "absolute",
    left: 48,
    top: 511,
    width: 298,
    height: 1,
    backgroundColor: "#d9d9d9",
  },
  easy: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 529,
    textAlign: "center",
    fontSize: 15.333,
    fontWeight: "600",
    lineHeight: 26.833,
  },
  socials: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 568,
    flexDirection: "row",
    justifyContent: "center",
    gap: 19,
  },
  social: { width: 34, height: 34 },
  googleError: {
    position: "absolute",
    left: 49,
    top: 612,
    width: 296,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#e75b5b",
  },
});
