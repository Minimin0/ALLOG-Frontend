import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";

// 하트 하나: 통통 튀며 나타난 뒤 계속 살짝 위아래로 움직임.
function AnimatedHeart({ delay }) {
  const scale = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 340,
      delay,
      easing: Easing.out(Easing.back(1.8)),
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(y, {
          toValue: -6,
          duration: 520,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.Text
      style={[s.heart, { transform: [{ scale }, { translateY: y }] }]}
    >
      ♥
    </Animated.Text>
  );
}

export default function CompleteScreen({ navigation }) {
  return (
    <View style={s.screen}>
      <View style={s.body}>
        <View style={s.check}>
          <Text style={s.checkText}>✓</Text>
        </View>
        <Text style={s.title}>환영합니다!{`\n`}하트 3개를 받았어요.</Text>
        <View style={s.heartsRow}>
          <AnimatedHeart delay={0} />
          <AnimatedHeart delay={120} />
          <AnimatedHeart delay={240} />
        </View>
        <Text style={s.copy}>
          <Text style={s.red}>하트</Text>는{" "}
          <Text style={s.bold}>그룹 참가</Text>에만 사용돼요.
        </Text>
        <View style={s.card}>
          <Text style={s.cardHead}>
            그룹에 참가할 때 <Text style={s.red}>하트 1개</Text>를 사용해요
          </Text>
          <View style={s.line} />
          <View style={s.flowRow}>
            <View style={s.condBox}>
              <Text style={s.condText}>
                그룹 공동 성공률 80% 이상{`\n`}+{`\n`}개인 달성률 70% 이상
              </Text>
            </View>
            <Text style={s.arrow}>→</Text>
            <View style={s.rewardBox}>
              <Text style={s.rewardText}>하트 1개를{`\n`}다시 받아요</Text>
            </View>
          </View>
        </View>
      </View>
      <Pressable style={s.button} onPress={() => navigation.replace("Home")}>
        <Text style={s.buttonText}>홈으로 가기</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f3", paddingHorizontal: 20 },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 36,
  },
  check: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { fontSize: 28, color: "#fff" },
  title: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 25,
    lineHeight: 32,
    fontWeight: "700",
  },
  heartsRow: {
    marginTop: 24,
    flexDirection: "row",
    gap: 12,
    height: 40,
    alignItems: "center",
  },
  heart: { fontSize: 34, color: "#d9573b" },
  copy: { marginTop: 24, fontSize: 18, fontWeight: "600", color: "#4a4a4a" },
  red: { color: "#d9573b", fontWeight: "700" },
  bold: { color: "#000", fontWeight: "700" },
  card: {
    marginTop: 24,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e7e3d8",
    borderRadius: 23,
    backgroundColor: "#fefefe",
    padding: 22,
    gap: 16,
  },
  cardHead: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "700",
    color: "#000",
  },
  line: { height: 1, backgroundColor: "#e7e3d8" },
  flowRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  condBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#dfe6e1",
    backgroundColor: "#eef3ef",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  condText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
    color: "#14453a",
  },
  arrow: { fontSize: 20, fontWeight: "700", color: "#9aa39c" },
  rewardBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#f6d4c8",
    backgroundColor: "#fdece5",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  rewardText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
    color: "#d9573b",
  },
  button: {
    height: 55,
    borderRadius: 27.5,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 52,
  },
  buttonText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
