import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Heart from "../../../assets/images/HeartIcon.svg";
import Svg, { Circle, Line } from "react-native-svg";
import { getCoachContent } from "../../../../src/data/mockChat.js";
import AnimatedEntrance from "../../components/AnimatedEntrance";
import { useAppState } from "../../state/AppState";
import { getCoachImage } from "../../utils/coach";
import { colors } from "../../theme";
function Header({ navigation, title }) {
  return (
    <View style={s.header}>
      <Pressable style={s.back} onPress={() => navigation.goBack()}>
        <Text style={s.backText}>‹</Text>
      </Pressable>
      <Text style={s.headerTitle}>{title}</Text>
      <View style={{ width: 43 }} />
    </View>
  );
}
export function AiCoachScreen({ navigation, route }) {
  const { coachStyle } = useAppState();
  const coachImage = getCoachImage(coachStyle);
  const { intro, qa } = getCoachContent(route.params?.from);
  const [msgs, setMsgs] = useState([
      {
        role: "ai",
        text: intro,
      },
    ]),
    ref = useRef(null);
  const ask = (item) => {
    setMsgs((x) => [...x, { role: "user", text: item.q }]);
    setTimeout(
      () => setMsgs((x) => [...x, { role: "ai", text: item.a, viz: item.viz }]),
      450,
    );
  };
  useEffect(() => setMsgs([{ role: "ai", text: intro }]), [intro]);
  useEffect(() => ref.current?.scrollToEnd({ animated: true }), [msgs]);
  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header navigation={navigation} title="AI 코칭" />
      <ScrollView ref={ref} contentContainerStyle={s.chat}>
        {msgs.map((m, i) => (
          <AnimatedEntrance
            key={`${m.role}-${i}`}
            distance={8}
            style={[s.message, m.role === "user" ? s.user : s.ai]}
          >
            {m.role === "ai" && (
              <Image
                source={coachImage}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
            )}
            <Text
              style={[s.messageText, m.role === "user" && { color: colors.white }]}
            >
              {m.text}
            </Text>
            {m.role === "ai" && m.viz ? <CoachViz viz={m.viz} /> : null}
          </AnimatedEntrance>
        ))}
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.suggestions}
      >
        {qa.map((item) => (
          <Pressable
            key={item.id}
            style={s.suggestion}
            onPress={() => ask(item)}
          >
            <Text style={s.suggestionText}>{item.q}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
function CoachViz({ viz }) {
  if (viz.type === "pips") {
    return (
      <View style={s.vizBlock}>
        <View style={s.pips}>
          {Array.from({ length: viz.total }, (_, i) => (
            <View key={i} style={[s.pip, i < viz.filled && s.pipOn]} />
          ))}
        </View>
        {viz.note ? <Text style={s.vizNote}>{viz.note}</Text> : null}
      </View>
    );
  }
  if (viz.type === "ring") {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    return (
      <View style={[s.vizBlock, s.ringRow]}>
        <View style={s.ringWrap}>
          <Svg
            width={84}
            height={84}
            viewBox="0 0 84 84"
            style={{ transform: [{ rotate: "-90deg" }] }}
          >
            <Circle
              cx="42"
              cy="42"
              r={radius}
              fill="none"
              stroke={colors.line}
              strokeWidth="9"
            />
            <Circle
              cx="42"
              cy="42"
              r={radius}
              fill="none"
              stroke={colors.primary}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference * (1 - viz.value / 100)}
            />
            <Line
              x1="42"
              y1="4"
              x2="42"
              y2="12"
              stroke={colors.reward}
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${viz.goal * 3.6} 42 42)`}
            />
          </Svg>
          <Text style={s.ringValue}>
            {viz.value}
            {viz.unit}
          </Text>
        </View>
        <Text style={s.ringCopy}>
          목표 {viz.goal}
          {viz.unit}
          {viz.note ? `\n${viz.note}` : ""}
        </Text>
      </View>
    );
  }
  if (viz.type === "columns") {
    const max = Math.max(...viz.data.map((item) => item.value));
    return (
      <View style={[s.vizBlock, s.columns]}>
        {viz.data.map((item) => (
          <View key={item.label} style={s.columnItem}>
            <Text style={[s.columnValue, item.highlight && s.highlight]}>
              {item.value}
              {viz.unit}
            </Text>
            <View
              style={[
                s.column,
                { height: (item.value / max) * 64 },
                item.highlight && s.columnOn,
              ]}
            />
            <Text style={[s.columnLabel, item.highlight && s.highlight]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    );
  }
  if (viz.type === "versus") {
    return (
      <View style={s.vizBlock}>
        {viz.metric ? <Text style={s.metric}>기준 · {viz.metric}</Text> : null}
        <View style={s.versus}>
          <VersusCard item={viz.left} unit={viz.unit} />
          <Text style={s.delta}>{viz.delta}</Text>
          <VersusCard item={viz.right} unit={viz.unit} active />
        </View>
      </View>
    );
  }
  return null;
}
function VersusCard({ item, unit, active }) {
  return (
    <View style={[s.versusCard, active && s.versusActive]}>
      <Text style={[s.versusValue, active && s.highlight]}>
        {item.value}
        <Text style={s.versusUnit}>{unit}</Text>
      </Text>
      <Text style={[s.columnLabel, active && s.highlight]}>{item.label}</Text>
    </View>
  );
}
const events = [
  ["verify", "오늘의 루틴 인증하기", "Camera"],
  ["follow", "ACC 인스타 그램 팔로우", "Explore"],
  ["invite", "친구 초대하기", "InviteGroup"],
  ["cheer", "친구 응원해주기", "Home"],
];
export function HeartEventScreen({ navigation }) {
  const {
    hearts,
    completedHeartEvents: completed,
    claimHeartEvent,
  } = useAppState();
  const [reward, setReward] = useState(null);
  const participate = (e) => {
    if (!claimHeartEvent(e[0])) {
      if (e[2] === "Explore")
        return navigation.navigate("Home", { screen: "Explore" });
      return navigation.navigate(e[2]);
    }
    setReward(e);
  };
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title="하트 이벤트" />
      <ScrollView contentContainerStyle={s.heartContent}>
        <View style={s.hero}>
          <View>
            <Text style={s.heroTitle}>하트를 모아{`\n`}다시 도전해요!</Text>
            <Text style={s.heroSub}>
              하트 이벤트에 참여하고 하트를 다시 획득할 수 있어요.
            </Text>
          </View>
          <View style={s.heartBalance}>
            <View style={s.heartRow}>
              <Heart width={18} height={17} />
              <Text style={s.heartCount}>{hearts}</Text>
            </View>
            <Text style={s.heartLabel}>보유 하트</Text>
          </View>
        </View>
        <View style={s.events}>
          {events.map((e) => {
            const done = completed.includes(e[0]);
            return (
              <Pressable
                key={e[0]}
                style={s.event}
                onPress={() => participate(e)}
              >
                <View style={[s.eventCheck, done && s.eventDone]}>
                  <Text style={s.checkMark}>✓</Text>
                </View>
                <Text style={s.eventTitle}>{e[1]}</Text>
                <Heart width={13} height={12} />
                <Text style={s.plus}>+1 ›</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <Modal visible={!!reward} transparent animationType="fade">
        <View style={s.dim}>
          <View style={s.rewardModal}>
            <Heart width={52} height={48} />
            <Text style={s.rewardTitle}>하트 1개를 획득했어요!</Text>
            <Text style={s.rewardSub}>{reward?.[1]} 완료</Text>
            <Pressable style={s.button} onPress={() => setReward(null)}>
              <Text style={s.buttonText}>확인</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const reasons = [
  ["ai-verdict", "AI 판정에 이의 있어요 (재인증 요청)"],
  ["not-related", "루틴과 관련 없는 인증이에요"],
  ["fake", "조작·도용된 인증 같아요"],
  ["offensive", "부적절한 내용이 포함돼 있어요"],
  ["etc", "기타"],
];
export function ReportScreen({ navigation }) {
  const [reason, setReason] = useState(null),
    [detail, setDetail] = useState(""),
    [done, setDone] = useState(false);
  const valid = reason && (reason !== "etc" || detail.trim());
  if (done)
    return (
      <View style={s.complete}>
        <View style={s.completeCheck}>
          <Text style={s.completeCheckText}>✓</Text>
        </View>
        <Text style={s.completeTitle}>접수됐어요</Text>
        <Text style={s.completeSub}>검토 후 결과를 알려드릴게요.</Text>
        <Pressable
          style={[s.button, { width: 150 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={s.buttonText}>돌아가기</Text>
        </Pressable>
      </View>
    );
  return (
    <KeyboardAvoidingView
      style={s.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Header navigation={navigation} title="재인증 요청 · 신고" />
      <ScrollView contentContainerStyle={s.report}>
        <Text style={s.reportIntro}>사유를 선택해 주세요.</Text>
        {reasons.map(([id, label]) => (
          <Pressable
            key={id}
            style={[s.reason, reason === id && s.reasonOn]}
            onPress={() => setReason(id)}
          >
            <View
              style={[s.radio, reason === id && { borderColor: colors.primary }]}
            >
              {reason === id && <View style={s.radioDot} />}
            </View>
            <Text style={s.reasonText}>{label}</Text>
          </Pressable>
        ))}
        <Text style={s.detailLabel}>
          상세 내용{" "}
          {reason === "etc" && <Text style={{ color: colors.danger }}>*</Text>}
        </Text>
        <TextInput
          multiline
          numberOfLines={4}
          value={detail}
          onChangeText={setDetail}
          placeholder="구체적인 내용을 적어주세요 (선택)"
          style={s.textarea}
        />
        <Pressable
          disabled={!valid}
          style={[s.button, !valid && { opacity: 0.4 }]}
          onPress={() => setDone(true)}
        >
          <Text style={s.buttonText}>제출하기</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    height: 56,
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
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
  headerTitle: { fontSize: 17, fontWeight: "700" },
  chat: { padding: 16, gap: 12 },
  message: {
    maxWidth: "86%",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  ai: {
    alignSelf: "flex-start",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
  },
  user: { alignSelf: "flex-end", backgroundColor: colors.primary },
  messageText: { flexShrink: 1, fontSize: 14, lineHeight: 21 },
  suggestions: {
    borderTopWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 8,
  },
  suggestion: {
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  suggestionText: { fontSize: 12, fontWeight: "600" },
  vizBlock: { marginTop: 12, width: "100%" },
  pips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pip: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.line,
  },
  pipOn: { borderColor: colors.primary, backgroundColor: colors.primary },
  vizNote: { marginTop: 8, fontSize: 11, fontWeight: "700", color: colors.primary },
  ringRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  ringWrap: {
    width: 84,
    height: 84,
    alignItems: "center",
    justifyContent: "center",
  },
  ringValue: {
    position: "absolute",
    fontSize: 17,
    fontWeight: "700",
    color: colors.primary,
  },
  ringCopy: { fontSize: 11, lineHeight: 18, color: colors.muted },
  columns: {
    height: 108,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 28,
  },
  columnItem: { alignItems: "center", justifyContent: "flex-end" },
  columnValue: {
    marginBottom: 5,
    fontSize: 10,
    fontWeight: "700",
    color: colors.muted,
  },
  column: {
    width: 28,
    minHeight: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "#dfe3e8",
  },
  columnOn: { backgroundColor: colors.primary },
  columnLabel: { marginTop: 5, fontSize: 10, color: colors.muted },
  highlight: { color: colors.primary, fontWeight: "700" },
  metric: { marginBottom: 6, fontSize: 10, color: colors.muted },
  versus: { flexDirection: "row", alignItems: "center", gap: 10 },
  versusCard: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: "#f1f0ed",
    paddingVertical: 10,
    alignItems: "center",
  },
  versusActive: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
  versusValue: { fontSize: 20, fontWeight: "700", color: colors.muted },
  versusUnit: { fontSize: 10 },
  delta: { fontSize: 11, fontWeight: "700", color: colors.reward },
  heartContent: { paddingHorizontal: 29, paddingTop: 28, paddingBottom: 35 },
  hero: { flexDirection: "row", justifyContent: "space-between" },
  heroTitle: { fontSize: 25, lineHeight: 32, fontWeight: "700" },
  heroSub: { marginTop: 12, width: 220, fontSize: 10, color: colors.subtle },
  heartBalance: {
    width: 114,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingVertical: 12,
    alignItems: "center",
  },
  heartRow: { flexDirection: "row", gap: 6, alignItems: "center" },
  heartCount: { fontSize: 18, fontWeight: "700" },
  heartLabel: { fontSize: 12, fontWeight: "600", color: colors.heart },
  events: { marginTop: 36, gap: 16 },
  event: {
    height: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  eventCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
  eventDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkMark: { fontSize: 12, color: colors.white },
  eventTitle: { flex: 1, fontSize: 13, fontWeight: "600" },
  plus: { fontSize: 12, fontWeight: "600" },
  dim: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  rewardModal: {
    width: 280,
    borderRadius: 20,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  rewardTitle: { marginTop: 16, fontSize: 17, fontWeight: "700" },
  rewardSub: { marginTop: 8, fontSize: 12, color: "#8a8a8a" },
  button: {
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  buttonText: { fontSize: 14, fontWeight: "700", color: colors.white },
  report: { padding: 20, paddingBottom: 35 },
  reportIntro: { fontSize: 15, color: colors.muted, marginBottom: 16 },
  reason: {
    minHeight: 50,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  reasonOn: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  reasonText: { fontSize: 14, color: colors.subtle },
  detailLabel: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: "600",
  },
  textarea: {
    height: 110,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 12,
    textAlignVertical: "top",
  },
  complete: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  completeCheck: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  completeCheckText: { fontSize: 30, color: colors.white },
  completeTitle: { fontSize: 22, fontWeight: "700" },
  completeSub: { fontSize: 15, color: colors.muted },
});
