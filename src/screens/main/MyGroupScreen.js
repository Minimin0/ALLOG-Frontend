import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Cheer from "../../../assets/images/CheerCoach.svg";
export default function MyGroupScreen() {
  const [tab, setTab] = useState("인증");
  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.title}>내 그룹</Text>
        {tab !== "정보" ? (
          <Cheer width={56} height={56} />
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
        {tab === "인증" ? <Feed /> : tab === "랭킹" ? <Ranking /> : <Info />}
      </ScrollView>
    </View>
  );
}
function Feed() {
  return (
    <>
      <View style={s.verifyCard}>
        <Text style={s.sectionTitle}>나</Text>
        <Text style={s.caption}>아직 오늘의 인증을 완료하지 않았어요.</Text>
        <Pressable style={s.button}>
          <Text style={s.buttonText}>지금 인증하기</Text>
        </Pressable>
      </View>
      {[
        "민수 · 2시간 전",
        "현지 · 5시간 전",
        "지민 · 인증 대기중",
        "지현 · 인증 대기중",
      ].map((x) => (
        <View key={x} style={s.row}>
          <View style={s.avatar} />
          <Text style={s.rowText}>{x}</Text>
          <Text style={s.arrow}>›</Text>
        </View>
      ))}
    </>
  );
}
function Ranking() {
  return (
    <>
      {[
        ["서준", "180분"],
        ["민수", "150분"],
        ["지민", "100분"],
        ["지현", "80분"],
        ["현지", "60분"],
      ].map((x, i) => (
        <View key={x[0]} style={s.rank}>
          <Text style={s.rankNo}>{i + 1}</Text>
          <View style={s.avatar} />
          <Text style={s.rowText}>
            {x[0]}
            {i === 0 ? "  나" : ""}
          </Text>
          <Text style={s.score}>{x[1]}</Text>
        </View>
      ))}
    </>
  );
}
function Info() {
  return (
    <View style={s.info}>
      <Text style={s.sectionTitle}>그룹 정보</Text>
      <Label label="챌린지" value="하루 운동 30분" />
      <Label label="기간" value="8.10 ~ 8.24 (14일)" />
      <Label label="남은 기간" value="D-2" />
      <Label label="초대 코드" value="7XQK92" />
      <Pressable style={s.button}>
        <Text style={s.buttonText}>초대하기</Text>
      </Pressable>
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
  score: { fontSize: 13, fontWeight: "700" },
  info: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
    padding: 18,
    gap: 10,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelValue: { fontSize: 13, fontWeight: "600" },
});
