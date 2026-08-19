import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AnimatedEntrance from "../../components/AnimatedEntrance";
import { useAppState } from "../../state/AppState";
import { getCoachImage } from "../../utils/coach";
import { colors } from "../../theme";
function Header({ navigation, title, right }) {
  return (
    <View style={s.header}>
      <Pressable style={s.back} onPress={() => navigation.goBack()}>
        <Text style={s.backText}>‹</Text>
      </Pressable>
      <Text style={s.headerTitle}>{title}</Text>
      {right || <View style={{ width: 43 }} />}
    </View>
  );
}
const ranking = [
  [1, "하윤", "2380점", false, "하루 물 2L"],
  [2, "서윤", "2210점", false, "아침 독서 20분"],
  [3, "민서", "2140점", false, "하루 운동 30분"],
  [4, "서준", "1980점", true, "하루 운동 30분"],
  [4, "지우", "1980점", false, "미라클 모닝"],
  [5, "예진", "1750점", false, "하루 명상 10분"],
  [6, "준호", "1600점", false, "계단 오르기"],
];
export function FullRankingScreen({ navigation }) {
  const { coachStyle, nickname } = useAppState();
  return (
    <View style={s.screen}>
      <Header
        navigation={navigation}
        title="전체 랭킹"
        right={
          <Image
            source={getCoachImage(coachStyle)}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        }
      />
      <ScrollView contentContainerStyle={s.content}>
        {ranking.map(([rank, name, score, me, group], index) => (
          <AnimatedEntrance key={`${rank}-${name}`} delay={index * 70}>
            <Rank
              rank={rank}
              name={me ? nickname : name}
              score={score}
              me={me}
              group={group}
            />
          </AnimatedEntrance>
        ))}
      </ScrollView>
    </View>
  );
}
function Rank({ rank, name, score, me, group }) {
  return (
    <View style={[s.rank, me && { backgroundColor: colors.primaryTint }]}>
      <Text style={s.rankNo}>{rank}</Text>
      <View style={s.avatar}>
        <Text>{name[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.rankName}>
          {name}
          {me ? "  나" : ""}
        </Text>
        <Text style={s.caption}>{group}</Text>
      </View>
      <Text style={s.rankScore}>{score}</Text>
    </View>
  );
}
const weights = [
  ["개인 루틴 달성률", 35, "개인 유효 인증 완료 횟수 ÷ 개인 전체 루틴 횟수"],
  [
    "그룹 공동 달성률",
    25,
    "그룹 전체 유효 인증 완료 횟수 ÷ 그룹 전체 목표 루틴 횟수",
  ],
  ["연속 인증", 20, "꾸준히 이어온 인증 일수"],
  ["그룹 기여도", 20, "동료 응원 및 그룹 체크인·공동 목표 활동 참여"],
];
export function RankingCriteriaScreen({ navigation }) {
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title="순위 평가 기준" />
      <ScrollView contentContainerStyle={s.content}>
        <Text style={s.intro}>
          순위는 아래 4가지 항목을{" "}
          <Text style={{ fontWeight: "700", color: colors.ink }}>
            가중 합산(총 100점)
          </Text>
          해서 정해져요.
        </Text>
        {weights.map(([name, weight, desc], index) => (
          <AnimatedEntrance key={name} delay={index * 60} style={s.criteria}>
            <View style={s.between}>
              <Text style={s.criteriaTitle}>{name}</Text>
              <View style={s.weight}>
                <Text style={s.weightText}>{weight}점</Text>
              </View>
            </View>
            <Text style={s.caption}>{desc}</Text>
            <View style={s.track}>
              <View style={[s.fill, { width: `${weight}%` }]} />
            </View>
          </AnimatedEntrance>
        ))}
        <View style={s.example}>
          <Text style={s.criteriaTitle}>계산 예시</Text>
          {[
            ["개인 루틴 달성률", "30 / 35점"],
            ["그룹 공동 달성률", "20 / 25점"],
            ["연속 인증", "15 / 20점"],
            ["그룹 기여도", "12 / 20점"],
          ].map((x) => (
            <View key={x[0]} style={s.exampleRow}>
              <Text style={s.caption}>{x[0]}</Text>
              <Text style={s.exampleValue}>{x[1]}</Text>
            </View>
          ))}
          <View style={s.line} />
          <View style={s.between}>
            <Text style={s.criteriaTitle}>내 점수</Text>
            <Text style={s.total}>77점</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
export function GroupResultScreen({ navigation }) {
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title="챌린지 결과" />
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.summary}>
          <Text style={s.resultTitle}>하루 운동 30분</Text>
          <Text style={s.caption}>8.10~8.24 참여자 5명</Text>
          <View style={[s.between, { marginTop: 16 }]}>
            <Text style={s.caption}>우리 그룹 공동 성공률</Text>
            <Text style={s.rate}>87%</Text>
          </View>
          <View style={s.track}>
            <View style={[s.fill, { width: "87%" }]} />
            <View style={s.marker} />
          </View>
          <Text style={s.goal}>그룹 목표 80%</Text>
        </View>
        <Podium showScore />
        <Text
          style={s.fullLink}
          onPress={() => navigation.navigate("FullRanking")}
        >
          전체 랭킹보기 &gt;
        </Text>
        <View style={s.myResult}>
          <ResultCell label="내 순위" value="1위" />
          <ResultCell label="내 점수" value="94점" />
          <ResultCell label="내 보상" value="1880" gold />
        </View>
        <Pressable style={s.button} onPress={() => navigation.navigate("Home")}>
          <Text style={s.buttonText}>리워드 교환하러 가기</Text>
        </Pressable>
        <Pressable
          style={[s.button, s.secondary]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={s.secondaryText}>다음 챌린지 찾아보러가기</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
function Podium({ showScore = false }) {
  return (
    <View style={s.podium}>
      {[
        [2, "민수", 82, 1640, 80],
        [1, "서준", 94, 1880, 112],
        [3, "지민", 70, 1400, 64],
      ].map(([rank, name, score, reward, height]) => (
        <View key={rank} style={s.podiumItem}>
          {showScore ? <Text style={s.podiumScore}>{score}점</Text> : null}
          <Text style={s.medal}>
            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
          </Text>
          <Text style={s.podiumName}>{name}</Text>
          <View style={[s.podiumBlock, { height }]}>
            <Text style={s.podiumRank}>{rank}</Text>
          </View>
          {showScore ? (
            <Text style={s.podiumReward}>
              보상{`\n`}✦ {reward}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
function ResultCell({ label, value, gold }) {
  return (
    <View style={s.resultCell}>
      <Text style={s.label}>{label}</Text>
      <Text style={[s.cellValue, gold && { color: colors.reward }]}>{value}</Text>
    </View>
  );
}
const members = [
  ["민지", false, true],
  ["지민", false, false],
  ["하민", true, false],
  ["편지", true, false],
  ["해주", true, false],
];
export function ExploreGroupDetailScreen({ navigation }) {
  const [tab, setTab] = useState("인증"),
    [joined, setJoined] = useState(false),
    [report, setReport] = useState(null),
    [reportReason, setReportReason] = useState("");
  return (
    <View style={s.screen}>
      <View style={s.groupHeader}>
        <Pressable style={s.roundBack} onPress={() => navigation.goBack()}>
          <Text style={s.backTextDark}>‹</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <View style={s.titleRow}>
            <Text style={s.detailTitle}>하루 운동 30분</Text>
            <View style={s.dayBadge}>
              <Text style={s.dayText}>DAY 5</Text>
            </View>
          </View>
          <Text style={s.caption}>오늘 2/5명 인증완료</Text>
        </View>
        <Pressable
          style={s.invite}
          onPress={() => navigation.navigate("InviteGroup")}
        >
          <Text style={s.inviteText}>🔗 7XQK92</Text>
        </Pressable>
      </View>
      <View style={s.tabs}>
        {["인증", "랭킹", "정보"].map((x) => (
          <Pressable key={x} style={s.tab} onPress={() => setTab(x)}>
            <Text style={[s.tabText, tab !== x && { color: colors.disabled }]}>
              {x}
            </Text>
            <View
              style={[s.tabLine, tab === x && { backgroundColor: colors.black }]}
            />
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {tab === "인증" ? (
          <View style={s.memberGrid}>
            {members.map(([name, done], i) => (
              <AnimatedEntrance key={name} delay={i * 60} style={s.memberCard}>
                {done ? (
                  <>
                    <View style={s.doneBox}>
                      <Image
                        source={require("../../../assets/images/workout-verify-native.jpg")}
                        style={StyleSheet.absoluteFillObject}
                        resizeMode="cover"
                      />
                    </View>
                    <Text style={s.memberName}>{name}</Text>
                    <Text style={s.comment} onPress={() => setReport(name)}>
                      댓글, 재인증 요청
                    </Text>
                  </>
                ) : (
                  <>
                    <View style={s.waitBox}>
                      <Text style={s.waitText}>
                        {i === 0
                          ? "아직 오늘 인증을 안했어요."
                          : "인증을 기다리는 중이에요."}
                      </Text>
                    </View>
                    <Text style={s.memberName}>{i === 0 ? "나" : name}</Text>
                    <Pressable
                      style={s.smallButton}
                      onPress={() =>
                        navigation.navigate(i === 0 ? "Camera" : "AiCoach")
                      }
                    >
                      <Text style={s.smallButtonText}>
                        {i === 0 ? "인증하기" : "응원하기"}
                      </Text>
                    </Pressable>
                  </>
                )}
              </AnimatedEntrance>
            ))}
          </View>
        ) : tab === "랭킹" ? (
          <>
            <Podium />
            <View style={s.rewardBox}>
              <Text style={s.criteriaTitle}>랭킹 보상</Text>
              {[
                ["1위 민지", "1540P"],
                ["2위 지민", "1080P"],
                ["3위 하민", "560P"],
              ].map((x) => (
                <View key={x[0]} style={s.exampleRow}>
                  <Text>{x[0]}</Text>
                  <Text style={{ fontWeight: "700" }}>🪙 {x[1]}</Text>
                </View>
              ))}
            </View>
            <Pressable
              style={s.outline}
              onPress={() => navigation.navigate("FullRanking")}
            >
              <Text style={s.outlineText}>전체 랭킹 보기</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={s.rewardBox}>
              <Info label="그룹명" value="하루 운동 30분" />
              <Info label="기간" value="8.10 ~ 8.24 (14일)" />
              <Info label="현재 인원" value="5명" />
            </View>
            <View style={s.summary}>
              <View style={s.between}>
                <Text>우리 그룹 공동 성공률</Text>
                <Text style={s.rateSmall}>60%</Text>
              </View>
              <View style={s.track}>
                <View style={[s.fill, { width: "60%" }]} />
              </View>
              <View style={s.between}>
                <Text style={s.caption}>2/5명 완료</Text>
                <Text style={s.goal}>그룹 목표 80%</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      {!joined && (
        <View style={s.sticky}>
          <Pressable
            style={s.button}
            onPress={() => {
              setJoined(true);
              navigation.navigate("JoinComplete");
            }}
          >
            <Text style={s.buttonText}>그룹 참가하기 (❤️ 1개 사용)</Text>
          </Pressable>
        </View>
      )}
      <Pressable style={s.fab} onPress={() => navigation.navigate("AiCoach")}>
        <Text style={s.fabText}>🤖{`\n`}AI 코칭</Text>
      </Pressable>
      <Modal visible={!!report} transparent animationType="slide">
        <Pressable style={s.dim} onPress={() => setReport(null)} />
        <View style={s.sheet}>
          <Text style={s.headerTitle}>{report}님의 인증 재확인 요청</Text>
          <Text style={s.intro}>요청 사유를 선택해주세요.</Text>
          {[
            "이전 인증과 동일한 사진",
            "인터넷 사진 도용",
            "인증 미션과 무관",
            "기타",
          ].map((x) => (
            <Pressable
              key={x}
              style={[s.reason, reportReason === x && s.reasonOn]}
              onPress={() => setReportReason(x)}
            >
              <Text>{x}</Text>
            </Pressable>
          ))}
          <Pressable
            disabled={!reportReason}
            style={[s.button, !reportReason && { opacity: 0.4 }]}
            onPress={() => {
              setReport(null);
              setReportReason("");
            }}
          >
            <Text style={s.buttonText}>요청 보내기</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
function Info({ label, value }) {
  return (
    <View style={s.infoRow}>
      <Text style={s.caption}>{label}</Text>
      <Text style={{ fontWeight: "700" }}>{value}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    height: 67,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 30, lineHeight: 32, color: colors.white },
  headerTitle: { fontSize: 19, fontWeight: "700" },
  content: { padding: 20, paddingBottom: 35, gap: 12 },
  rank: {
    height: 62,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rankNo: { width: 24, fontSize: 18, fontWeight: "700", color: colors.primary },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  rankName: { flex: 1, fontSize: 14, fontWeight: "600" },
  rankScore: { fontSize: 13, fontWeight: "700" },
  intro: { fontSize: 15, lineHeight: 23, color: colors.muted },
  criteria: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 16,
  },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  criteriaTitle: { fontSize: 17, fontWeight: "600" },
  weight: {
    borderRadius: 99,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  weightText: { fontSize: 12, color: colors.white },
  caption: { marginTop: 6, fontSize: 11, color: colors.muted },
  track: {
    marginTop: 9,
    height: 7,
    borderRadius: 99,
    backgroundColor: colors.surfaceAlt,
  },
  fill: { height: 7, borderRadius: 99, backgroundColor: colors.primary },
  example: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.primaryTint,
    padding: 16,
    gap: 7,
  },
  exampleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exampleValue: { fontSize: 11, fontWeight: "600" },
  line: { height: 1, backgroundColor: colors.line, marginVertical: 6 },
  total: { fontSize: 25, fontWeight: "700", color: colors.primary },
  summary: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.primaryTint,
    padding: 20,
  },
  resultTitle: { textAlign: "center", fontSize: 22, fontWeight: "700" },
  rate: { fontSize: 22, fontWeight: "800", color: colors.primary },
  marker: {
    position: "absolute",
    left: "80%",
    top: -4,
    width: 2,
    height: 15,
    backgroundColor: colors.reward,
  },
  goal: { marginTop: 5, textAlign: "right", fontSize: 11, color: colors.reward },
  podium: {
    height: 180,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 12,
  },
  podiumItem: { alignItems: "center" },
  medal: { fontSize: 25 },
  podiumName: { fontSize: 12, fontWeight: "700" },
  podiumScore: { fontSize: 12, fontWeight: "700" },
  podiumReward: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 10,
    lineHeight: 15,
    color: colors.reward,
  },
  podiumBlock: {
    marginTop: 6,
    width: 78,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  podiumRank: { fontSize: 25, fontWeight: "700", color: colors.primary },
  fullLink: {
    textAlign: "right",
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
  },
  myResult: {
    height: 84,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    flexDirection: "row",
  },
  resultCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderColor: colors.line,
  },
  label: { fontSize: 12 },
  cellValue: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: "700",
    color: colors.primary,
  },
  button: {
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 15, fontWeight: "700", color: colors.white },
  secondary: { backgroundColor: colors.line },
  secondaryText: { fontSize: 15, fontWeight: "700", color: colors.subtle },
  groupHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roundBack: {
    width: 43,
    height: 43,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  backTextDark: { fontSize: 30, lineHeight: 32 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailTitle: { fontSize: 18, fontWeight: "700" },
  dayBadge: {
    borderRadius: 99,
    backgroundColor: colors.primaryPale,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  dayText: { fontSize: 11, fontWeight: "700", color: colors.primary },
  invite: {
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  inviteText: { fontSize: 11, fontWeight: "700" },
  tabs: { paddingHorizontal: 20, flexDirection: "row" },
  tab: { flex: 1, alignItems: "center", paddingTop: 12, paddingBottom: 12 },
  tabText: { fontSize: 14, fontWeight: "700" },
  tabLine: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: colors.line,
  },
  memberGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  memberCard: {
    width: "48%",
    minHeight: 176,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 12,
  },
  doneBox: {
    height: 110,
    borderRadius: 10,
    backgroundColor: colors.primaryPale,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  waitBox: { height: 80, alignItems: "center", justifyContent: "center" },
  waitText: { textAlign: "center", fontSize: 13, color: colors.subtle },
  memberName: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
  comment: { marginTop: 6, fontSize: 10, color: colors.subtle },
  smallButton: {
    marginTop: 8,
    borderRadius: 99,
    backgroundColor: colors.black,
    paddingVertical: 8,
    alignItems: "center",
  },
  smallButtonText: { fontSize: 12, fontWeight: "700", color: colors.white },
  rewardBox: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 16,
    gap: 8,
  },
  outline: {
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  outlineText: { fontSize: 13, fontWeight: "700" },
  rateSmall: { fontSize: 16, fontWeight: "700" },
  infoRow: {
    height: 42,
    borderBottomWidth: 1,
    borderColor: colors.line,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sticky: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  fab: {
    position: "absolute",
    right: 18,
    bottom: 92,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  fabText: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "700",
    color: colors.white,
  },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.45)" },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.white,
    padding: 24,
    gap: 10,
  },
  reason: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  reasonOn: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
});
