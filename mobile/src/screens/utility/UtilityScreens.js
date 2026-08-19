import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import OnboardingShell from "../../components/OnboardingShell";
import { colors } from "../../theme";
export function FirebaseDebugScreen({ navigation }) {
  const [groupId, setGroupId] = useState("1"),
    [result, setResult] = useState(null);
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.back} onPress={() => navigation.navigate("Login")}>
        &lt; 로그인으로
      </Text>
      <Text style={s.title}>Firebase 인증 디버그 (7B-2)</Text>
      <View style={s.card}>
        <Text>
          <Text style={s.bold}>Firebase Login: </Text>미로그인
        </Text>
        <Text>
          <Text style={s.bold}>ID Token 발급 여부: </Text>미발급
        </Text>
      </View>
      <Text style={s.help}>
        로그인 화면에서 구글 로그인을 먼저 진행해주세요.
      </Text>
      <Text style={s.label}>groupId (테스트용, 하드코딩 아님)</Text>
      <TextInput value={groupId} onChangeText={setGroupId} style={s.input} />
      <Pressable
        style={s.button}
        onPress={() => setResult("Firebase 설정과 로그인이 필요합니다.")}
      >
        <Text style={s.buttonText}>백엔드 API 호출 (정상 토큰)</Text>
      </Pressable>
      {result && (
        <View style={s.card}>
          <Text style={s.error}>{result}</Text>
        </View>
      )}
    </ScrollView>
  );
}
export function PreferPeriodScreen() {
  return (
    <View style={s.placeholder}>
      <Text style={s.placeholderTitle}>PreferPeriodPage</Text>
    </View>
  );
}
const recommendations = [
  ["아침 체력 루틴 방", "주 3회 · 30일 · 운동 + 생활 패턴", "새벽 루틴 정착형"],
  ["식사 관리 도전 방", "주 5회 · 14일 · 식사 + 수면", "배식 루틴 집중형"],
  [
    "저녁 회복 루틴 방",
    "주 2회 · 30일 · 수면 + 스트레스 관리",
    "회복형 루틴 추천",
  ],
];
export function GroupRecommendScreen({ navigation }) {
  return (
    <OnboardingShell
      step={5}
      total={5}
      title="맞춤 루틴 방을 추천해드려요."
      subtitle="나와 비슷한 생활 패턴을 가진 그룹을 골라보세요."
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate("OnboardingComplete")}
      nextLabel="홈으로 가기"
    >
      {recommendations.map(([name, detail, badge]) => (
        <View key={name} style={s.recommend}>
          <View style={s.between}>
            <Text style={s.recommendName}>{name}</Text>
            <View style={s.badge}>
              <Text style={s.badgeText}>{badge}</Text>
            </View>
          </View>
          <Text style={s.recommendDetail}>{detail}</Text>
        </View>
      ))}
    </OnboardingShell>
  );
}
export function InviteLandingScreen() {
  return (
    <View style={s.placeholder}>
      <Text style={s.placeholderTitle}>InviteLandingPage</Text>
    </View>
  );
}
const sections = [
  [
    "내 그룹 (인증·랭킹)",
    [
      ["내 그룹 (랭킹 탭 기본)", "Home"],
      ["순위 평가 기준", "RankingCriteria"],
      ["전체 랭킹", "FullRanking"],
      ["합산 (챌린지 결과)", "GroupResult"],
    ],
  ],
  [
    "인증 촬영 플로우",
    [
      ["① 인증 시작", "Verification"],
      ["② 카메라 촬영", "Camera"],
      ["④ 동영상 분석중", "VerificationLoading"],
      ["⑤ 결과(성공/재인증)", "VerificationResult"],
    ],
  ],
  ["재인증 / 신고", [["재인증 요청 · 신고", "Report"]]],
];
export function DevHomeScreen({ navigation }) {
  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <Text style={s.devTitle}>ALLOG · 개발 네비</Text>
      <Text style={s.devSub}>
        담당 화면 라우팅 확인용. 눌러서 각 화면으로 이동합니다.
      </Text>
      {sections.map(([title, links]) => (
        <View key={title} style={s.devSection}>
          <Text style={s.sectionTitle}>{title}</Text>
          {links.map(([label, route]) => (
            <Pressable
              key={route}
              style={s.devLink}
              onPress={() => navigation.navigate(route)}
            >
              <Text style={s.devLinkText}>{label}</Text>
              <Text style={s.route}>{route}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
export function PlaceholderScreen({ navigation, route }) {
  return (
    <View style={s.placeholder}>
      <Text style={s.ready}>준비중 화면</Text>
      <Text style={s.placeholderTitle}>
        {route.params?.title || "페이지를 찾을 수 없어요"}
      </Text>
      <Text style={s.help}>{route.params?.note || "경로를 확인해주세요."}</Text>
      <Pressable
        style={[s.button, { width: 180 }]}
        onPress={() => navigation.navigate("Start")}
      >
        <Text style={s.buttonText}>처음으로</Text>
      </Pressable>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingBottom: 40, gap: 14 },
  back: { fontSize: 13, fontWeight: "600", color: colors.muted },
  title: { fontSize: 20, fontWeight: "700", marginVertical: 8 },
  card: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 16,
    gap: 8,
  },
  bold: { fontWeight: "700" },
  help: { fontSize: 13, lineHeight: 20, color: colors.muted },
  label: { marginTop: 8, fontSize: 12, fontWeight: "600", color: colors.subtle },
  input: {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
  },
  button: {
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 13, fontWeight: "700", color: colors.white },
  error: { fontSize: 12, color: colors.heart },
  placeholder: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  placeholderTitle: { fontSize: 20, fontWeight: "700", textAlign: "center" },
  recommend: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e1dfdb",
    backgroundColor: "#f6f4f2",
    padding: 16,
    marginBottom: 12,
  },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  recommendName: { fontSize: 15, fontWeight: "700" },
  badge: {
    borderRadius: 99,
    backgroundColor: "#edf9ee",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#1f6a45" },
  recommendDetail: { marginTop: 8, fontSize: 12, color: "#67635f" },
  devTitle: { fontSize: 24, fontWeight: "700" },
  devSub: { fontSize: 14, color: colors.muted },
  devSection: { gap: 8, marginTop: 14 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.muted },
  devLink: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 14,
  },
  devLinkText: { fontSize: 14, fontWeight: "600" },
  route: { marginTop: 3, fontSize: 11, color: colors.muted },
  ready: { fontSize: 12, fontWeight: "600", color: colors.muted },
});
