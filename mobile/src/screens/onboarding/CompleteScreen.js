import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme";
export default function CompleteScreen({ navigation }) {
  return (
    <View style={s.screen}>
      <View style={s.body}>
        <View style={s.check}>
          <Text style={s.checkText}>✓</Text>
        </View>
        <Text style={s.title}>환영합니다!{`\n`}하트 3개를 받았어요.</Text>
        <Text style={s.hearts}>♥ ♥ ♥</Text>
        <Text style={s.copy}>
          <Text style={s.red}>하트</Text>는{" "}
          <Text style={s.bold}>그룹 참가</Text>에만 사용돼요.
        </Text>
        <View style={s.card}>
          <Text style={s.cardText}>
            그룹에 참가할 때 <Text style={s.red}>하트 1개</Text>를 사용해요.
          </Text>
          <View style={s.line} />
          <Text style={s.cardText}>
            그룹 공동 성공률 80% 이상 + 개인 달성율 70% 이상
          </Text>
          <Text style={s.down}>↓</Text>
          <Text style={[s.cardText, s.red]}>하트 1개를 다시 받아요.</Text>
        </View>
      </View>
      <Pressable style={s.button} onPress={() => navigation.replace("Home")}>
        <Text style={s.buttonText}>홈으로 가기</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  body: { flex: 1, alignItems: "center", paddingTop: 80 },
  check: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { fontSize: 28, color: colors.white },
  title: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "700",
  },
  hearts: { marginTop: 24, fontSize: 34, color: colors.heart },
  copy: { marginTop: 24, fontSize: 18, fontWeight: "600", color: colors.subtle },
  red: { color: colors.heart, fontWeight: "700" },
  bold: { color: colors.black, fontWeight: "700" },
  card: {
    marginTop: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 23,
    backgroundColor: colors.surface,
    padding: 20,
    gap: 10,
  },
  cardText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 24,
    color: colors.subtle,
  },
  line: { height: 1, backgroundColor: colors.line },
  down: { textAlign: "center", color: colors.disabled },
  button: {
    height: 55,
    borderRadius: 27.5,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  buttonText: { fontSize: 15, fontWeight: "700", color: colors.white },
});
