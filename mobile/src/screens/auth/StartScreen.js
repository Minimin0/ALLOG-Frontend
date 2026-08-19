import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import DesignScreen from "../../components/DesignScreen";

export default function StartScreen({ navigation }) {
  return (
    <DesignScreen backgroundColor="#fff">
      <View style={s.body}>
        <View style={s.logo}>
          <Image
            source={require("../../../assets/images/Logo.png")}
            style={s.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={s.tagline}>Anti Lazing Log</Text>
        <Text style={s.title}>건강한 습관을{`\n`}함께 만들어요.</Text>
        <Text style={s.copy}>
          AI 코치와 함께하는 루틴 챌린지.{`\n`}크루와 함께라면 더 오래 지속할 수
          있어요.
        </Text>
      </View>
      <View style={s.actions}>
        <Pressable
          style={s.primary}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={s.primaryText}>시작하기</Text>
        </Pressable>
        <Text style={s.loginCopy}>
          이미 계정이 있으신가요?{" "}
          <Text
            style={s.loginLink}
            onPress={() => navigation.navigate("Login")}
          >
            로그인
          </Text>
        </Text>
      </View>
    </DesignScreen>
  );
}
const s = StyleSheet.create({
  body: { alignItems: "center", paddingTop: 47 },
  logo: { marginTop: 120, width: 76, height: 76 },
  logoImage: { width: 76, height: 76 },
  tagline: {
    marginTop: 1,
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 35,
    letterSpacing: -0.6,
  },
  title: {
    marginTop: 12,
    width: 282,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    lineHeight: 29.5,
    letterSpacing: 1.4,
  },
  copy: {
    marginTop: 18,
    width: 274,
    textAlign: "center",
    fontSize: 12.643,
    fontWeight: "500",
  },
  actions: { position: "absolute", top: 588, left: 48, width: 296 },
  primary: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontSize: 18, fontWeight: "700", color: "#fff" },
  loginCopy: {
    height: 35,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 35,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
