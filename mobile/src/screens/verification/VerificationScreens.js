import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useVideoPlayer, VideoView } from "expo-video";
import AnimatedEntrance from "../../components/AnimatedEntrance";
import { colors } from "../../theme";
const mascot = require("../../../assets/images/mascot.png");
function Header({ navigation, title = "오늘의 인증", green = false }) {
  return (
    <View style={s.header}>
      <Pressable
        style={[s.back, green && { backgroundColor: colors.primary }]}
        onPress={() => navigation.goBack()}
      >
        <Text style={s.backText}>‹</Text>
      </Pressable>
      <Text style={s.headerTitle}>{title}</Text>
      <View style={{ width: 43 }} />
    </View>
  );
}
function Button({ children, onPress, secondary = false }) {
  return (
    <Pressable style={[s.button, secondary && s.secondary]} onPress={onPress}>
      <Text style={[s.buttonText, secondary && { color: colors.subtle }]}>
        {children}
      </Text>
    </Pressable>
  );
}
export function VerificationStartScreen({ navigation }) {
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Header navigation={navigation} />
      <DayCard detailed />
      <Pressable
        style={s.captureArea}
        onPress={() => navigation.navigate("Camera")}
      >
        <View style={s.videoIcon}>
          <Text style={{ fontSize: 28 }}>▰</Text>
        </View>
        <Text style={s.body}>동영상 촬영</Text>
      </Pressable>
      <Guide />
      <Button onPress={() => navigation.navigate("Camera")}>인증하기</Button>
    </ScrollView>
  );
}
function DayCard({ detailed = false }) {
  return (
    <View style={s.dayCard}>
      <Text style={s.day}>DAY 5</Text>
      <Text style={s.dayTitle}>하루 운동 30분</Text>
      {detailed && (
        <>
          <Text style={s.caption}>오늘 2/5명 인증완료</Text>
          <View style={s.dots}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[s.dot, i < 2 && s.done]} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}
function Guide() {
  return (
    <View style={s.guide}>
      <Text style={s.guideTitle}>인증 가이드</Text>
      <Text style={s.guideText}>
        • 오늘 촬영한 동영상만 인증 가능합니다.{`\n`}• 얼굴은 가려도 괜찮습니다.
        {`\n`}• 운동하는 모습이 잘 보이도록 촬영해주세요.
      </Text>
      <View style={s.recordInfo}>
        <Text style={s.caption}>
          ▰ 기록은{" "}
          <Text style={{ fontWeight: "700", color: colors.primary }}>
            3초 내외 짧은 동영상
          </Text>
          으로 저장돼요.
        </Text>
      </View>
    </View>
  );
}
export function CameraScreen({ navigation }) {
  const ref = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [recording, setRecording] = useState(false),
    [progress, setProgress] = useState(0);
  useEffect(() => {
    if (recording && progress < 3) {
      const t = setTimeout(() => setProgress((x) => x + 1), 1000);
      return () => clearTimeout(t);
    }
  }, [recording, progress]);
  if (!permission)
    return (
      <View style={s.cameraFallback}>
        <ActivityIndicator color={colors.white} />
      </View>
    );
  if (!permission.granted)
    return (
      <View style={s.cameraFallback}>
        <Text style={s.white}>카메라 권한이 필요해요.</Text>
        <Button onPress={requestPermission}>권한 허용</Button>
      </View>
    );
  const record = async () => {
    if (recording) return;
    setRecording(true);
    setProgress(0);
    try {
      const video = await ref.current?.recordAsync({ maxDuration: 3 });
      if (video?.uri) navigation.replace("Preview", { uri: video.uri });
    } finally {
      setRecording(false);
    }
  };
  return (
    <View style={s.cameraScreen}>
      <View style={s.progress}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              s.progressDot,
              i < progress && { backgroundColor: "#3ddc84" },
            ]}
          />
        ))}
      </View>
      <View style={s.cameraWrap}>
        <CameraView
          ref={ref}
          style={StyleSheet.absoluteFill}
          facing="back"
          mode="video"
          mute
        />
      </View>
      <Pressable disabled={recording} style={s.shutter} onPress={record} />
    </View>
  );
}
export function PreviewScreen({ navigation, route }) {
  const uri = route.params?.uri;
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.play();
  });
  if (!uri)
    return (
      <View style={s.empty}>
        <Text>촬영된 결과가 없어요.</Text>
        <Button onPress={() => navigation.replace("Camera")}>
          촬영하러 가기
        </Button>
      </View>
    );
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Header navigation={navigation} />
      <DayCard />
      <View style={s.preview}>
        <VideoView
          player={player}
          style={StyleSheet.absoluteFill}
          nativeControls
          contentFit="cover"
        />
      </View>
      <Guide />
      <Button
        onPress={() => navigation.replace("VerificationLoading", { uri })}
      >
        인증하기
      </Button>
      <Button secondary onPress={() => navigation.replace("Camera")}>
        다시 촬영하기
      </Button>
    </ScrollView>
  );
}
const checks = [
  ["▧", "영상 품질 확인", "선명도와 구도 확인"],
  ["⚑", "챌린지 일치 여부 확인", "챌린지 조건 확인"],
  ["◷", "촬영 시간 확인", "오늘 촬영된 동영상인지 확인"],
  ["⊞", "중복 이미지 검사", "이전에 제출한 사진과 비교"],
];
export function VerificationLoadingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1400,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  useEffect(() => {
    if (step >= 4) {
      const t = setTimeout(
        () => navigation.replace("VerificationResult", { result: "success" }),
        350,
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep((x) => x + 1), 700);
    return () => clearTimeout(t);
  }, [step, navigation]);
  return (
    <View style={[s.screen, s.loading]}>
      <Header navigation={navigation} green />
      <View style={s.mascotRingWrap}>
        <Animated.View
          style={[
            s.mascotRing,
            {
              transform: [
                {
                  rotate: spin.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            },
          ]}
        />
        <Image source={mascot} style={s.mascotImage} resizeMode="contain" />
      </View>
      <Text style={s.analysis}>AI 가 인증 내용을 분석하고 있어요.</Text>
      <Text style={s.wait}>잠시만 기다려주세요.</Text>
      <View style={s.checkCard}>
        {checks.map(([icon, title, sub], i) => (
          <View key={title} style={[s.checkRow, i < 3 && s.checkLine]}>
            <Text style={s.checkIcon}>{icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.checkTitle}>{title}</Text>
              <Text style={s.checkSub}>{sub}</Text>
            </View>
            {i < step ? (
              <View style={s.checkDone}>
                <Text style={s.white}>✓</Text>
              </View>
            ) : i === step ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <View style={s.checkPending} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
export function VerificationResultScreen({ navigation, route }) {
  const success = (route.params?.result || "success") === "success";
  return (
    <View style={s.result}>
      <View style={s.resultBody}>
        {success ? (
          <>
            <AnimatedEntrance distance={8} style={s.bubble}>
              <Text style={s.bubbleText}>오늘도 해냈어요! 🌱</Text>
            </AnimatedEntrance>
            <AnimatedEntrance delay={80} distance={10} style={s.mascotCircle}>
              <Image
                source={mascot}
                style={s.mascotImage}
                resizeMode="contain"
              />
            </AnimatedEntrance>
            <Text style={s.resultTitle}>인증 성공!</Text>
            <View style={s.feedback}>
              <View style={s.feedbackBox}>
                <Text style={s.caption}>연속 성공</Text>
                <Text style={s.feedbackValue}>
                  3<Text style={s.caption}>일 🔥</Text>
                </Text>
              </View>
              <View style={s.feedbackBox}>
                <Text style={s.caption}>최근 인증</Text>
                <Text style={s.feedbackTime}>저녁 9시대</Text>
              </View>
            </View>
            <Text style={s.caption}>
              주로 저녁 9시대에 인증했어요. 이 페이스 그대로! 💪
            </Text>
          </>
        ) : (
          <>
            <View style={s.alert}>
              <Text style={s.alertText}>!</Text>
            </View>
            <Text style={s.resultTitle}>재인증이 필요해요</Text>
            <Text style={s.bodyMuted}>
              실패가 아니에요 — 아래 항목이 확인되지 않았을 뿐이에요.
            </Text>
            <View style={s.retryBox}>
              <Text style={s.retryTitle}>확인되지 않은 점</Text>
              <Text>
                • 운동 동작이 명확히 보이지 않았어요{`\n`}• 영상이 너무 짧았어요
                (3초 미만)
              </Text>
            </View>
            <View style={[s.retryBox, { backgroundColor: colors.primaryTint }]}>
              <Text style={[s.retryTitle, { color: colors.primary }]}>
                이렇게 다시 찍어보세요
              </Text>
              <Text>
                ✓ 전신이 화면에 들어오게 촬영해요{`\n`}✓ 동작을 3초 이상 이어서
                담아요{`\n`}✓ 밝은 곳에서 흔들림 없이 찍어요
              </Text>
            </View>
          </>
        )}
      </View>
      {success ? (
        <Button onPress={() => navigation.navigate("Home")}>내 그룹으로</Button>
      ) : (
        <>
          <Button onPress={() => navigation.replace("Camera")}>
            다시 촬영하기
          </Button>
          <Text style={s.appeal} onPress={() => navigation.navigate("Report")}>
            판정에 이의 있어요 · 재인증 요청
          </Text>
        </>
      )}
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 16, paddingBottom: 35 },
  header: {
    height: 43,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    width: 43,
    height: 43,
    borderRadius: 9,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 32, color: colors.white, lineHeight: 34 },
  headerTitle: { fontSize: 22, fontWeight: "600" },
  button: {
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: { backgroundColor: colors.line },
  buttonText: { fontSize: 15, fontWeight: "700", color: colors.white },
  dayCard: {
    alignSelf: "center",
    width: "86%",
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 20,
    alignItems: "center",
    elevation: 2,
  },
  day: { fontSize: 12, color: colors.primary },
  dayTitle: { fontSize: 22, fontWeight: "700" },
  caption: { marginTop: 4, fontSize: 11, color: colors.muted },
  dots: { marginTop: 12, flexDirection: "row", gap: 8 },
  dot: { width: 21, height: 21, borderRadius: 11, backgroundColor: colors.surfaceAlt },
  done: { backgroundColor: colors.primary },
  captureArea: {
    alignSelf: "center",
    width: 297,
    height: 396,
    borderRadius: 51,
    backgroundColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  videoIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { fontSize: 15, color: colors.ink },
  guide: { borderRadius: 24, backgroundColor: colors.primaryTint, padding: 20 },
  guideTitle: { fontSize: 17, fontWeight: "700", marginBottom: 10 },
  guideText: { fontSize: 15, lineHeight: 28, color: colors.muted },
  recordInfo: {
    marginTop: 12,
    borderRadius: 15,
    backgroundColor: colors.white,
    padding: 10,
  },
  cameraScreen: { flex: 1, backgroundColor: colors.black, paddingVertical: 24 },
  progress: {
    height: 30,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,.3)",
  },
  cameraWrap: {
    flex: 1,
    marginHorizontal: 20,
    borderRadius: 44,
    overflow: "hidden",
  },
  shutter: {
    alignSelf: "center",
    marginTop: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,.4)",
  },
  cameraFallback: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    padding: 30,
  },
  white: { color: colors.white },
  preview: {
    height: 440,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: colors.black,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  loading: { padding: 20, backgroundColor: colors.primaryTint },
  mascotRingWrap: {
    marginTop: 38,
    alignSelf: "center",
    width: 164,
    height: 164,
    borderRadius: 82,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mascotRing: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 6,
    borderColor: colors.primary,
    borderTopColor: "rgba(20,69,58,0.12)",
    borderRadius: 82,
  },
  mascotImage: { width: "92%", height: "92%" },
  analysis: {
    marginTop: 28,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
  },
  wait: { marginTop: 8, textAlign: "center", fontSize: 20, color: colors.muted },
  checkCard: {
    marginTop: 32,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
  },
  checkRow: {
    height: 74,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkLine: { borderBottomWidth: 1, borderColor: colors.line },
  checkIcon: { fontSize: 26 },
  checkTitle: { fontSize: 15, fontWeight: "600" },
  checkSub: { fontSize: 10, color: colors.muted },
  checkDone: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkPending: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.line,
  },
  result: { flex: 1, backgroundColor: colors.bg, padding: 24 },
  resultBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  bubble: {
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 4,
  },
  bubbleText: { fontSize: 15, fontWeight: "600" },
  mascotCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  resultTitle: { fontSize: 22, fontWeight: "700" },
  feedback: { width: "100%", flexDirection: "row", gap: 8 },
  feedbackBox: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: colors.primaryTint,
    padding: 12,
    alignItems: "center",
  },
  feedbackValue: { fontSize: 22, fontWeight: "700", color: colors.primary },
  feedbackTime: {
    paddingTop: 5,
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  alert: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  alertText: { fontSize: 36, color: colors.white },
  bodyMuted: { fontSize: 15, color: colors.muted, textAlign: "center" },
  retryBox: {
    width: "100%",
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 16,
  },
  retryTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.danger,
    marginBottom: 8,
  },
  appeal: {
    padding: 12,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: colors.danger,
  },
});
