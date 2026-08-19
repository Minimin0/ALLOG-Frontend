import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../theme";
const cats = ["수분케어", "식사", "운동", "수면"],
  durations = ["7일", "14일", "30일"];
const generateInviteCode = () => {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length: 6 },
    () => alphabet[Math.floor(Math.random() * alphabet.length)],
  ).join("");
};
function Header({ navigation, title }) {
  return (
    <View style={s.header}>
      <Pressable style={s.back} onPress={() => navigation.goBack()}>
        <Text style={s.backText}>‹</Text>
      </Pressable>
      <Text style={s.headerTitle}>{title}</Text>
    </View>
  );
}
function Choice({ active, onPress, children, style }) {
  return (
    <Pressable onPress={onPress} style={[s.choice, style, active && s.active]}>
      <Text style={s.choiceText}>{children}</Text>
    </Pressable>
  );
}
export function CreateGroupScreen({ navigation }) {
  const [category, setCategory] = useState(""),
    [name, setName] = useState(""),
    [duration, setDuration] = useState("14일"),
    [capacity, setCapacity] = useState(5),
    [visibility, setVisibility] = useState("public"),
    [times, setTimes] = useState([{ start: "07:00", end: "22:00" }]);
  const valid = category && name.trim();
  const updateTime = (index, key, value) =>
    setTimes((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, [key]: value } : slot,
      ),
    );
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title="그룹 만들기" />
      <ScrollView contentContainerStyle={s.content}>
        <Section title="카테고리 선택">
          <View style={s.row}>
            {cats.map((x) => (
              <Choice
                key={x}
                style={s.categoryChoice}
                active={category === x}
                onPress={() => setCategory(x)}
              >
                {x}
              </Choice>
            ))}
          </View>
        </Section>
        <Section title="그룹명">
          <TextInput
            style={s.input}
            value={name}
            onChangeText={setName}
            placeholder="매일 물 2L 마시기"
          />
        </Section>
        <Section title="진행기간">
          <View style={s.row}>
            {durations.map((x) => (
              <Choice
                key={x}
                style={s.durationChoice}
                active={duration === x}
                onPress={() => setDuration(x)}
              >
                {x}
              </Choice>
            ))}
          </View>
        </Section>
        <Section title="참여 인원">
          <View style={s.counter}>
            <Pressable
              style={s.circle}
              onPress={() => setCapacity((x) => Math.max(2, x - 1))}
            >
              <Text>-</Text>
            </Pressable>
            <Text style={s.count}>{capacity}명</Text>
            <Pressable
              style={s.circle}
              onPress={() => setCapacity((x) => Math.min(10, x + 1))}
            >
              <Text>+</Text>
            </Pressable>
          </View>
        </Section>
        <Section
          title="인증 시간 설정"
          action={
            <Pressable
              style={s.add}
              disabled={times.length >= 5}
              onPress={() =>
                setTimes((x) => [...x, { start: "07:00", end: "22:00" }])
              }
            >
              <Text style={s.addText}>+</Text>
            </Pressable>
          }
        >
          {times.map((x, i) => (
            <View key={i} style={s.time}>
              {times.length > 1 ? (
                <View style={s.timeSlotHead}>
                  <Text style={s.timeSlotName}>인증 시간 {i + 1}</Text>
                  <Pressable
                    accessibilityLabel={`인증 시간 ${i + 1} 삭제`}
                    style={s.removeButton}
                    onPress={() => setTimes((v) => v.filter((_, j) => j !== i))}
                  >
                    <Text style={s.remove}>×</Text>
                  </Pressable>
                </View>
              ) : null}
              <View style={s.timeRow}>
                <View style={s.timeField}>
                  <Text style={s.timeLabel}>시작</Text>
                  <TextInput
                    value={x.start}
                    maxLength={5}
                    onChangeText={(value) => updateTime(i, "start", value)}
                    style={s.timeInput}
                  />
                </View>
                <Text style={s.timeDivider}>~</Text>
                <View style={s.timeField}>
                  <Text style={s.timeLabel}>마감</Text>
                  <TextInput
                    value={x.end}
                    maxLength={5}
                    onChangeText={(value) => updateTime(i, "end", value)}
                    style={s.timeInput}
                  />
                </View>
              </View>
            </View>
          ))}
        </Section>
        <Section title="공개 범위">
          <View style={s.row}>
            <VisibilityChoice
              active={visibility === "public"}
              onPress={() => setVisibility("public")}
              title="공개"
              description="누구나 참여할 수 있어요."
            />
            <VisibilityChoice
              active={visibility === "private"}
              onPress={() => setVisibility("private")}
              title="비공개"
              description="초대한 사람만 참여할 수 있어요."
            />
          </View>
        </Section>
      </ScrollView>
      <SafeAreaView edges={["bottom"]} style={s.createFooter}>
        <Pressable
          disabled={!valid}
          style={[s.primary, !valid && s.disabled]}
          onPress={() =>
            navigation.navigate("GroupCreated", {
              title: name,
              capacity,
              code: generateInviteCode(),
            })
          }
        >
          <Text style={s.primaryText}>그룹 만들기</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
function VisibilityChoice({ active, onPress, title, description }) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.visibilityChoice, active && s.active]}
    >
      <View style={[s.visibilityDot, active && s.visibilityDotActive]}>
        {active ? <View style={s.visibilityDotInner} /> : null}
      </View>
      <Text style={s.visibilityTitle}>{title}</Text>
      <Text style={s.visibilityDescription}>{description}</Text>
    </Pressable>
  );
}
function Section({ title, action, children }) {
  return (
    <View style={s.section}>
      <View style={s.sectionHead}>
        <Text style={s.sectionTitle}>{title}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}
export function GroupCreatedScreen({ navigation, route }) {
  const {
    title = "매일 물 2L 마시기",
    capacity = 5,
    code = "7XQK92",
  } = route.params || {};
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Center>
      <Check />
      <Text style={s.completeTitle}>
        '{title}' 그룹이 생성되었어요!{`\n`}
        {capacity}명이 모이면 시작돼요.
      </Text>
      <CodeBox code={code} copied={copied} onCopy={copy} />
      <Pressable
        style={s.primary}
        onPress={() =>
          navigation.navigate("WaitingRoom", { title, capacity, code })
        }
      >
        <Text style={s.primaryText}>대기실로 이동</Text>
      </Pressable>
    </Center>
  );
}
export function WaitingRoomScreen({ navigation, route }) {
  const {
    title = "하루 운동 30분",
    capacity = 5,
    code = "7XQK92",
    existingCount = 0,
  } = route.params || {};
  const [members, setMembers] = useState([
    ...["민수", "현지", "지민", "지현"].slice(0, existingCount),
    "나",
  ]);
  useEffect(() => {
    if (members.length >= capacity) return;
    const t = setTimeout(
      () =>
        setMembers((v) => [
          ...v,
          ["민수", "현지", "지민", "지현"][v.length - 1] ||
            `멤버 ${v.length + 1}`,
        ]),
      1800,
    );
    return () => clearTimeout(t);
  }, [members, capacity]);
  const full = members.length >= capacity;
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title="대기실" />
      <ScrollView contentContainerStyle={s.content}>
        <CodeBox code={code} />
        <View style={s.waitCard}>
          <Text style={s.waitTitle}>{title}</Text>
          <Text style={s.waitStatus}>
            {full
              ? "모든 인원이 모였어요!"
              : `${members.length}/${capacity}명 모였어요`}
          </Text>
          <View style={s.dots}>
            {Array.from({ length: capacity }).map((_, i) => (
              <View
                key={i}
                style={[s.memberDot, i < members.length && s.memberDone]}
              />
            ))}
          </View>
        </View>
        <Text style={s.listTitle}>참여한 멤버</Text>
        {members.map((x, i) => (
          <View key={`${x}${i}`} style={s.member}>
            <View style={s.avatar}>
              <Text>{x === "나" ? "나" : x[0]}</Text>
            </View>
            <Text style={s.memberName}>{x}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={s.footer}>
        <Pressable
          disabled={!full}
          style={[s.primary, !full && s.disabled]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={s.primaryText}>
            {full ? "그룹 시작하기" : "인원을 기다리는 중..."}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
export function JoinByCodeScreen({ navigation }) {
  const [code, setCode] = useState(""),
    [error, setError] = useState("");
  const submit = () => {
    if (code === "7XQK92") navigation.navigate("Home");
    else setError("존재하지 않는 코드예요. 코드를 다시 확인해주세요.");
  };
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title="코드로 참여하기" />
      <View style={s.content}>
        <Text style={s.help}>
          친구에게 받은 6자리 초대 코드를 입력해주세요.
        </Text>
        <TextInput
          autoFocus
          maxLength={6}
          autoCapitalize="characters"
          value={code}
          onChangeText={(v) => {
            setCode(v.toUpperCase());
            setError("");
          }}
          placeholder="ABC123"
          style={s.codeInput}
        />
        {error ? <Text style={s.error}>{error}</Text> : null}
      </View>
      <View style={s.footer}>
        <Pressable
          disabled={code.length < 6}
          style={[s.primary, code.length < 6 && s.disabled]}
          onPress={submit}
        >
          <Text style={s.primaryText}>참여하기</Text>
        </Pressable>
      </View>
    </View>
  );
}
export function JoinCompleteScreen({ navigation, route }) {
  const title = route.params?.title || "매일 물 1.5L 마시기";
  return (
    <Center>
      <Check />
      <Text style={s.bigTitle}>그룹 참가 완료!</Text>
      <Text style={s.joinCopy}>
        <Text style={{ color: colors.primary }}>{title}</Text> 그룹에 참가했어요.
      </Text>
      <Text style={s.heartCopy}>
        <Text style={{ color: colors.heart }}>하트</Text> 1개가 사용됐어요.
      </Text>
      <View style={s.heartBox}>
        <Text style={s.heartLabel}>잔여 하트 수</Text>
        <Text style={s.hearts}>♥ 2</Text>
      </View>
      <View style={{ flex: 1 }} />
      <Pressable
        style={s.primary}
        onPress={() =>
          navigation.navigate("WaitingRoom", {
            title,
            capacity: 5,
            existingCount: 3,
          })
        }
      >
        <Text style={s.primaryText}>그룹으로 이동</Text>
      </Pressable>
      <Text style={s.later} onPress={() => navigation.navigate("Home")}>
        나중에 볼게요
      </Text>
    </Center>
  );
}
export function InviteGroupScreen({ navigation }) {
  const [copied, setCopied] = useState(false),
    code = "7XQK92";
  const copy = async () => {
    await Clipboard.setStringAsync(code);
    setCopied(true);
  };
  return (
    <View style={s.screen}>
      <Header navigation={navigation} title="친구 초대하기" />
      <View style={s.content}>
        <View style={s.invite}>
          <Text style={s.inviteTitle}>하루 운동 30분</Text>
          <Text style={s.help}>
            아래 코드를 공유하면 친구가 바로 참여할 수 있어요.
          </Text>
          <View style={s.codeLarge}>
            <Text style={s.codeText}>{code}</Text>
          </View>
          <Pressable style={s.copyWide} onPress={copy}>
            <Text>{copied ? "복사됨" : "코드 복사하기"}</Text>
          </Pressable>
        </View>
        <View style={s.guide}>
          <Text style={s.sectionTitle}>참여 방법</Text>
          <Text style={s.help}>
            1. 탐색 화면에서 '코드로 참여하기'를 눌러요.{`\n`}2. 위 코드를
            입력하면 바로 참여돼요.
          </Text>
        </View>
      </View>
      <View style={s.footer}>
        <Pressable style={s.primary} onPress={() => navigation.goBack()}>
          <Text style={s.primaryText}>그룹으로 돌아가기</Text>
        </Pressable>
      </View>
    </View>
  );
}
function Center({ children }) {
  return <View style={s.center}>{children}</View>;
}
function Check() {
  return (
    <View style={s.check}>
      <Text style={s.checkText}>✓</Text>
    </View>
  );
}
function CodeBox({ code = "7XQK92", copied, onCopy }) {
  return (
    <View style={s.codeBox}>
      <Text style={s.help}>친구에게 이 코드를 공유해주세요</Text>
      <View style={s.codeRow}>
        <Text style={s.codeText}>{code}</Text>
        {onCopy && (
          <Pressable style={s.copy} onPress={onCopy}>
            <Text>{copied ? "복사됨" : "복사"}</Text>
          </Pressable>
        )}
      </View>
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
    gap: 12,
  },
  back: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  backText: { fontSize: 32, color: colors.white, lineHeight: 34 },
  headerTitle: { fontSize: 19, fontWeight: "700" },
  content: { paddingHorizontal: 20, paddingBottom: 28, gap: 24 },
  section: { gap: 8 },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontSize: 15, fontWeight: "700" },
  row: { flexDirection: "row", gap: 8 },
  choice: {
    flex: 1,
    minHeight: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  categoryChoice: { minHeight: 40, borderRadius: 99, paddingHorizontal: 6 },
  durationChoice: { minHeight: 48 },
  active: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primaryPale,
  },
  choiceText: { textAlign: "center", fontSize: 13, fontWeight: "600" },
  input: {
    height: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  counter: {
    height: 64,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0eee8",
    alignItems: "center",
    justifyContent: "center",
  },
  count: { fontSize: 16, fontWeight: "700" },
  add: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: { color: colors.white, fontWeight: "700" },
  time: {
    minHeight: 70,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  timeSlotHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeSlotName: { fontSize: 11, fontWeight: "700", color: colors.muted },
  timeRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  timeField: {
    flex: 1,
    height: 40,
    borderRadius: 11,
    backgroundColor: colors.bg,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeLabel: { fontSize: 11, fontWeight: "600", color: colors.subtle },
  timeInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 4,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
  timeDivider: { color: colors.disabled },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#f0eee8",
    alignItems: "center",
    justifyContent: "center",
  },
  remove: { fontSize: 17, lineHeight: 18, color: colors.muted },
  visibilityChoice: {
    flex: 1,
    minHeight: 94,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingHorizontal: 13,
    paddingVertical: 13,
  },
  visibilityDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.disabled,
    alignItems: "center",
    justifyContent: "center",
  },
  visibilityDotActive: { borderColor: colors.primary },
  visibilityDotInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  visibilityTitle: { marginTop: 8, fontSize: 14, fontWeight: "700" },
  visibilityDescription: {
    marginTop: 3,
    fontSize: 10,
    lineHeight: 15,
    color: colors.muted,
  },
  createFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.bg,
  },
  primary: {
    width: "100%",
    height: 55,
    borderRadius: 27.5,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
  primaryText: { fontSize: 15, fontWeight: "700", color: colors.white },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 32,
    paddingVertical: 80,
    alignItems: "center",
    gap: 24,
  },
  check: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.black,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: { fontSize: 28, color: colors.white },
  completeTitle: {
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 28,
  },
  codeBox: {
    width: "100%",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 16,
    alignItems: "center",
  },
  codeRow: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  codeText: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: 4,
    color: colors.primary,
  },
  copy: {
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  waitCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.primaryTint,
    padding: 20,
    alignItems: "center",
  },
  waitTitle: { fontSize: 17, fontWeight: "700" },
  waitStatus: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  dots: { marginTop: 12, flexDirection: "row", gap: 8 },
  memberDot: {
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: colors.line,
  },
  memberDone: { backgroundColor: colors.primary },
  listTitle: { fontSize: 13, fontWeight: "700", color: colors.subtle },
  member: {
    height: 60,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0eee8",
    alignItems: "center",
    justifyContent: "center",
  },
  memberName: { fontSize: 14, fontWeight: "600" },
  footer: { paddingHorizontal: 20, paddingBottom: 28 },
  help: { fontSize: 12, lineHeight: 20, color: colors.muted },
  codeInput: {
    marginTop: 8,
    height: 58,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 6,
  },
  error: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: colors.heart,
  },
  bigTitle: { fontSize: 25, fontWeight: "700" },
  joinCopy: { fontSize: 16, color: colors.muted },
  heartCopy: { fontSize: 18, fontWeight: "600" },
  heartBox: {
    width: 243,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingVertical: 24,
    alignItems: "center",
  },
  heartLabel: { fontSize: 15, fontWeight: "600", color: colors.heart },
  hearts: { marginTop: 5, fontSize: 20, fontWeight: "700", color: colors.heart },
  later: { fontSize: 15, fontWeight: "600", color: colors.muted },
  invite: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.primaryTint,
    padding: 24,
    alignItems: "center",
  },
  inviteTitle: { fontSize: 14, fontWeight: "600" },
  codeLarge: {
    marginTop: 16,
    width: "100%",
    borderRadius: 15,
    backgroundColor: colors.white,
    paddingVertical: 20,
    alignItems: "center",
  },
  copyWide: {
    marginTop: 16,
    width: "100%",
    height: 44,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  guide: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    padding: 16,
    gap: 8,
  },
});
