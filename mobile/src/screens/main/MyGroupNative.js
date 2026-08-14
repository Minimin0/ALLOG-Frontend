import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AnimatedEntrance from "../../components/AnimatedEntrance";
import CoachMascotButton from "../../components/CoachMascotButton";
import * as Clipboard from "expo-clipboard";
export default function MyGroupNative({ navigation }) {
  const [tab, setTab] = useState("인증");
  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.title}>내 그룹</Text>
        {tab !== "정보" ? (
          <CoachMascotButton
            size={56}
            source={require("../../../assets/images/CheerCoach.png")}
            onPress={() =>
              navigation.navigate("AiCoach", {
                from: tab === "인증" ? "feed" : "ranking",
              })
            }
          />
        ) : (
          <View style={{ width: 56 }} />
        )}
      </View>
      <View style={s.summary}>
        <Text style={s.day}>DAY 5</Text>
        <Text style={s.groupTitle}>하루 운동 30분</Text>
        <Text style={s.caption}>오늘 2/5명 인증완료</Text>
        <View style={s.bubbles}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View key={i} style={[s.bubble, i < 2 ? s.done : s.wait]} />
          ))}
        </View>
      </View>
      <View style={s.tabs}>
        {["인증", "랭킹", "정보"].map((x) => (
          <Pressable key={x} style={s.tab} onPress={() => setTab(x)}>
            <Text style={[s.tabText, tab !== x && { color: "#6b7268" }]}>
              {x}
            </Text>
            <View
              style={[s.underline, tab === x && { backgroundColor: "#111" }]}
            />
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={s.content}>
        {tab === "인증" ? (
          <Feed navigation={navigation} />
        ) : tab === "랭킹" ? (
          <Ranking navigation={navigation} />
        ) : (
          <Info navigation={navigation} />
        )}
      </ScrollView>
    </View>
  );
}
function Feed({ navigation }) {
  const [reportTarget, setReportTarget] = useState(null);
  const [cheer, setCheer] = useState(false);
  const [reportReason, setReportReason] = useState("");
  return (
    <>
      <View style={s.feedGrid}>
        <PendingCard
          me
          name="나"
          onPress={() => navigation.navigate("Verification")}
        />
        <VerifiedCard
          name="민수"
          time="2시간 전"
          onReport={() => setReportTarget("민수")}
        />
        <VerifiedCard
          name="현지"
          time="5시간 전"
          onReport={() => setReportTarget("현지")}
        />
        <PendingCard name="지민" onPress={() => setCheer(true)} />
        <PendingCard name="지현" onPress={() => setCheer(true)} />
      </View>
      <Modal visible={!!reportTarget} transparent animationType="slide">
        <Pressable style={s.modalDim} onPress={() => setReportTarget(null)} />
        <View style={s.reportSheet}>
          <Text style={s.sectionTitle}>
            {reportTarget}님의 인증 재확인 요청
          </Text>
          {[
            "이전 인증과 동일한 사진",
            "인터넷 사진 도용",
            "인증 미션과 무관",
            "기타",
          ].map((reason) => (
            <Pressable
              key={reason}
              style={[s.reason, reportReason === reason && s.reasonOn]}
              onPress={() => setReportReason(reason)}
            >
              <Text>{reason}</Text>
            </Pressable>
          ))}
          <Pressable
            disabled={!reportReason}
            style={[s.button, !reportReason && { opacity: 0.4 }]}
            onPress={() => {
              setReportTarget(null);
              setReportReason("");
            }}
          >
            <Text style={s.buttonText}>요청 보내기</Text>
          </Pressable>
        </View>
      </Modal>
      <Modal
        visible={cheer}
        transparent
        animationType="fade"
        onShow={() => setTimeout(() => setCheer(false), 2000)}
      >
        <CheerCelebration />
      </Modal>
    </>
  );
}
function CheerCelebration() {
  const scale = useRef(new Animated.Value(0.55)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        speed: 16,
        bounciness: 12,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, scale]);
  return (
    <View style={s.cheerOverlay}>
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (Math.PI * 2 * index) / 12;
        return (
          <Animated.View
            key={index}
            style={[
              s.cheerParticle,
              {
                opacity,
                backgroundColor: index % 2 ? "#f0cf68" : "#d9573b",
                transform: [
                  { translateX: Math.cos(angle) * 142 },
                  { translateY: Math.sin(angle) * 142 },
                  { rotate: `${index * 30}deg` },
                  { scale },
                ],
              },
            ]}
          />
        );
      })}
      <Animated.Image
        source={require("../../../assets/images/cheer-heart.png")}
        style={[s.cheerImage, { opacity, transform: [{ scale }] }]}
        resizeMode="contain"
      />
      <Animated.Text style={[s.cheerText, { opacity, transform: [{ scale }] }]}>
        응원을 보냈어요!
      </Animated.Text>
    </View>
  );
}
function VerifiedCard({ name, time, onReport }) {
  return (
    <View style={s.verifiedCard}>
      <Image
        source={require("../../../assets/images/workout-verify-native.jpg")}
        style={s.verifiedImage}
        resizeMode="cover"
      />
      <Pressable style={s.more} onPress={onReport}>
        <Text style={s.moreText}>⋯</Text>
      </Pressable>
      <View style={s.verifiedInfo}>
        <View style={s.avatar}>
          <Text>{name[0]}</Text>
        </View>
        <View>
          <Text style={s.verifiedName}>{name}</Text>
          <Text style={s.verifiedTime}>{time}</Text>
        </View>
      </View>
    </View>
  );
}
function PendingCard({ name, me, onPress }) {
  return (
    <View style={[s.pendingCard, me && s.pendingMe]}>
      <Text style={s.pendingTitle}>
        {me ? "아직 오늘\n인증을 안했어요." : "인증을\n기다리는 중이에요."}
      </Text>
      <View style={s.pendingCenter}>
        <Pressable style={s.smallButton} onPress={onPress}>
          <Text style={s.smallButtonText}>{me ? "인증하기" : "응원하기"}</Text>
        </Pressable>
      </View>
      <View style={s.pendingUser}>
        <View style={s.avatarDark}>
          <Text style={s.avatarDarkText}>{me ? "나" : name[0]}</Text>
        </View>
        {!me ? <Text>{name}</Text> : null}
      </View>
    </View>
  );
}
function Ranking({ navigation }) {
  return (
    <>
      {[
        ["서준", "180분"],
        ["민수", "150분"],
        ["지민", "100분"],
        ["지현", "80분"],
        ["현지", "60분"],
      ].map((x, i) => (
        <AnimatedEntrance key={x[0]} delay={i * 90}>
          <Pressable
            style={[
              s.rank,
              i === 0 && s.rankGold,
              i === 1 && s.rankSilver,
              i === 2 && s.rankBronze,
            ]}
            onPress={() => navigation.navigate("RankingCriteria")}
          >
            <Text style={s.rankNo}>
              {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
            </Text>
            <View style={s.avatar} />
            <Text style={s.rowText}>
              {x[0]}
              {i === 0 ? "  나" : ""}
            </Text>
            <Text style={s.score}>{x[1]}</Text>
          </Pressable>
        </AnimatedEntrance>
      ))}
      <Pressable
        style={s.outline}
        onPress={() => navigation.navigate("FullRanking")}
      >
        <Text style={s.outlineText}>전체 랭킹 보기</Text>
      </Pressable>
    </>
  );
}
function Info({ navigation }) {
  const [membersOpen, setMembersOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const members = ["나", "민수", "지민", "지현", "현지"];
  const copyInvite = async () => {
    await Clipboard.setStringAsync("7XQK92");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <View style={s.info}>
      <Label label="그룹명" value="하루 운동 30분" />
      <Label label="기간" value="8.10 ~ 8.24 (14일)" />
      <Pressable style={s.labelRow} onPress={() => setMembersOpen((v) => !v)}>
        <Text style={s.caption}>현재 인원</Text>
        <Text style={s.labelValue}>5명 {membersOpen ? "⌄" : "›"}</Text>
      </Pressable>
      {membersOpen ? (
        <AnimatedEntrance distance={6} style={s.memberList}>
          {members.map((member) => (
            <View key={member} style={s.member}>
              <View style={s.memberAvatar}>
                <Text style={s.memberAvatarText}>{member[0]}</Text>
              </View>
              <Text style={s.memberName}>{member}</Text>
            </View>
          ))}
        </AnimatedEntrance>
      ) : null}
      <Pressable style={s.labelRow} onPress={copyInvite}>
        <Text style={s.caption}>초대 코드</Text>
        <Text style={s.labelValue}>▣ 7XQK92</Text>
      </Pressable>
      <AnimatedEntrance style={s.successCard}>
        <View style={s.between}>
          <Text style={s.successLabel}>우리 그룹 공동 성공률</Text>
          <Text style={s.successRate}>72%</Text>
        </View>
        <View style={s.successTrack}>
          <View style={s.successFill} />
          <View style={s.successGoalMarker} />
        </View>
        <View style={s.between}>
          <Text style={s.caption}>2/5명 완료</Text>
          <Text style={s.successGoal}>그룹 목표 80%</Text>
        </View>
      </AnimatedEntrance>
      <View style={s.infoStats}>
        <View style={s.infoStat}>
          <Text style={s.statLabel}>남은 기간</Text>
          <Text style={s.statBig}>D-2</Text>
        </View>
        <View style={s.infoDivider} />
        <View style={s.infoStat}>
          <Text style={s.statLabel}>내 순위</Text>
          <Text style={s.statBig}>2위</Text>
        </View>
      </View>
      <Text style={s.sectionTitle}>예상 보상</Text>
      <View style={s.podium}>
        {[
          ["민수", "300P", 76, "#d7dce3"],
          ["서준", "500P", 102, "#f0cf68"],
          ["지민", "200P", 58, "#ca8c68"],
        ].map(([name, reward, height, color]) => (
          <View key={name} style={s.podiumItem}>
            <Text style={s.podiumName}>{name}</Text>
            <View style={[s.podiumBar, { height, backgroundColor: color }]}>
              <Text style={s.podiumReward}>{reward}</Text>
            </View>
          </View>
        ))}
      </View>
      <Pressable
        style={s.outline}
        onPress={() => navigation.navigate("GroupResult")}
      >
        <Text style={s.outlineText}>챌린지 결과 보기</Text>
      </Pressable>
      {copied ? (
        <AnimatedEntrance distance={4} style={s.copyToast}>
          <Text style={s.copyToastText}>🌱 복사했어요!</Text>
        </AnimatedEntrance>
      ) : null}
    </View>
  );
}
function Label({ label, value }) {
  return (
    <View style={s.labelRow}>
      <Text style={s.caption}>{label}</Text>
      <Text style={s.labelValue}>{value}</Text>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f3" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "700" },
  summary: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#edf2ec",
    padding: 16,
  },
  day: { fontSize: 12 },
  groupTitle: { fontSize: 22, fontWeight: "700" },
  caption: { marginTop: 4, fontSize: 11, color: "#6b7268" },
  bubbles: { flexDirection: "row", gap: 8, marginTop: 12 },
  bubble: { width: 32, height: 32, borderRadius: 16 },
  done: { backgroundColor: "#14453a" },
  wait: { backgroundColor: "#eae9e7" },
  tabs: { marginTop: 16, marginHorizontal: 20, flexDirection: "row" },
  tab: { flex: 1, alignItems: "center", paddingBottom: 10 },
  tabText: { fontSize: 17, fontWeight: "600" },
  underline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
    backgroundColor: "#e7e3d8",
  },
  content: { padding: 20, paddingBottom: 35, gap: 10 },
  feedGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  pendingCard: {
    width: "48%",
    aspectRatio: 3 / 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
    padding: 16,
  },
  pendingMe: { backgroundColor: "#edf2ec" },
  pendingTitle: { fontSize: 14, lineHeight: 20, fontWeight: "700" },
  pendingCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  smallButton: {
    borderRadius: 99,
    backgroundColor: "#000",
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  smallButtonText: { fontSize: 11, fontWeight: "700", color: "#fff" },
  pendingUser: { flexDirection: "row", alignItems: "center", gap: 7 },
  avatarDark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarDarkText: { fontSize: 10, fontWeight: "600", color: "#fff" },
  verifiedCard: {
    width: "48%",
    aspectRatio: 3 / 4,
    borderRadius: 18,
    backgroundColor: "#111",
    overflow: "hidden",
  },
  verifiedImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  more: { position: "absolute", right: 8, top: 4, padding: 4 },
  moreText: { fontSize: 22, color: "#fff" },
  verifiedInfo: {
    position: "absolute",
    left: 9,
    bottom: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  verifiedName: { fontSize: 11, fontWeight: "700", color: "#fff" },
  verifiedTime: { fontSize: 9, color: "rgba(255,255,255,.8)" },
  modalDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,.45)",
  },
  reportSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#fff",
    padding: 24,
    gap: 10,
  },
  reason: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  reasonOn: {
    borderWidth: 2,
    borderColor: "#14453a",
    backgroundColor: "#eaf4ec",
  },
  cheerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cheerImage: { width: 280, height: 280 },
  cheerParticle: {
    position: "absolute",
    width: 7,
    height: 34,
    borderRadius: 2,
  },
  cheerText: {
    marginTop: -24,
    borderRadius: 99,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: "700",
    color: "#14453a",
  },
  verifyCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
    padding: 16,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  button: {
    height: 44,
    borderRadius: 16,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  buttonText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  row: {
    height: 64,
    borderRadius: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#eae9e7",
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1, fontSize: 14, fontWeight: "600" },
  arrow: { fontSize: 18, color: "#bababa" },
  rank: {
    height: 62,
    borderRadius: 15,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rankNo: { width: 20, fontSize: 18, fontWeight: "700", color: "#14453a" },
  rankGold: {
    borderWidth: 2,
    borderColor: "#d6aa47",
    backgroundColor: "#fff6dc",
  },
  rankSilver: {
    borderWidth: 2,
    borderColor: "#b6bcc4",
    backgroundColor: "#f3f4f6",
  },
  rankBronze: {
    borderWidth: 2,
    borderColor: "#b97851",
    backgroundColor: "#f7e7dc",
  },
  score: { fontSize: 13, fontWeight: "700" },
  info: {
    gap: 10,
  },
  labelRow: {
    minHeight: 42,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e7e3d8",
  },
  labelValue: { fontSize: 13, fontWeight: "600" },
  between: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#e7e3d8",
  },
  member: { width: 46, alignItems: "center", gap: 4 },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  memberName: { fontSize: 10 },
  successCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
  },
  successLabel: { fontSize: 12, fontWeight: "700" },
  successRate: { fontSize: 20, fontWeight: "800", color: "#14453a" },
  successTrack: {
    marginVertical: 9,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e7e3d8",
  },
  successFill: {
    width: "72%",
    height: 8,
    borderRadius: 4,
    backgroundColor: "#14453a",
  },
  successGoalMarker: {
    position: "absolute",
    left: "80%",
    top: -4,
    width: 2,
    height: 16,
    backgroundColor: "#c08a24",
  },
  successGoal: { fontSize: 11, color: "#c08a24" },
  infoStats: {
    marginTop: 4,
    height: 84,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
  },
  infoStat: { flex: 1, alignItems: "center", gap: 4 },
  infoDivider: { width: 1, height: 48, backgroundColor: "#e7e3d8" },
  podium: {
    height: 150,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 8,
  },
  podiumItem: { width: 76, alignItems: "center" },
  podiumName: { marginBottom: 5, fontSize: 11, fontWeight: "700" },
  podiumBar: {
    width: 76,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  podiumReward: { fontSize: 12, fontWeight: "800" },
  copyToast: {
    position: "absolute",
    left: 58,
    right: 58,
    top: 190,
    borderRadius: 99,
    backgroundColor: "#fff",
    paddingVertical: 12,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  copyToastText: { color: "#14453a", fontSize: 13, fontWeight: "700" },
  outline: {
    height: 44,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  outlineText: { fontSize: 13, fontWeight: "700" },
});
