import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Cheer from "../../../assets/images/CheerCoach.svg";
import Heart from "../../../assets/images/HeartIcon.svg";
import Reward from "../../../assets/images/RewardIcon.svg";
import Chart from "../../../assets/images/ChartIcon.svg";
import Fire from "../../../assets/images/FireIcon.svg";
export default function HomeScreen({ navigation }) {
  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.logo}>ALLOG</Text>
        <Pressable>
          <Cheer width={54} height={54} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.row}>
          <Card
            icon={<Heart width={21} height={19} />}
            value="3"
            label="보유 하트"
            note="하트 이벤트 가기 >"
          />
          <Card
            icon={<Reward width={18} height={18} />}
            value="1540"
            label="포인트"
            note="포인트 혜택 보러가기 >"
          />
        </View>
        <View style={s.routine}>
          <View style={s.routineTop}>
            <Text style={s.smallGreen}>오늘의 루틴</Text>
            <Text style={s.routineTitle}>하루 운동 30분</Text>
            <Pressable style={s.verify}>
              <Text style={s.verifyText}>인증하러 가기</Text>
            </Pressable>
          </View>
          <View style={s.routineBottom}>
            <Text style={s.deadline}>마감 오후 10:00</Text>
            <View style={s.vline} />
            <Text style={s.deadline}>3시간 12분 남음</Text>
          </View>
        </View>
        <View style={s.stats}>
          <View style={s.stat}>
            <View style={s.inline}>
              <Chart width={16} height={16} />
              <Text style={s.statLabel}>개인 순위</Text>
            </View>
            <Text>
              <Text style={s.statBig}>2</Text>
              <Text style={s.statLabel}> 위 / 5명</Text>
            </Text>
          </View>
          <View style={s.vlineTall} />
          <View style={s.stat}>
            <View style={s.inline}>
              <Fire width={16} height={16} />
              <Text style={s.statLabel}>연속 성공</Text>
            </View>
            <Text>
              <Text style={s.statBig}>3</Text>
              <Text style={s.statLabel}>일째</Text>
            </Text>
          </View>
        </View>
        <View style={s.gaugeCard}>
          <View style={s.between}>
            <Text style={s.gaugeLabel}>개인 성공률</Text>
            <Text style={s.rate}>60%</Text>
          </View>
          <View style={s.track}>
            <View style={s.fill} />
          </View>
          <Text style={s.goal}>개인 목표 70%</Text>
        </View>
      </ScrollView>
    </View>
  );
}
function Card({ icon, value, label, note }) {
  return (
    <Pressable style={s.card}>
      <View style={s.inline}>
        {icon}
        <Text style={s.value}>{value}</Text>
      </View>
      <Text style={s.cardLabel}>{label}</Text>
      <Text style={s.note}>{note}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f3" },
  header: {
    height: 76,
    paddingHorizontal: 30,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { fontSize: 28, fontWeight: "700" },
  content: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 110,
    gap: 16,
  },
  row: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inline: { flexDirection: "row", alignItems: "center", gap: 7 },
  value: { fontSize: 18, fontWeight: "700" },
  cardLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#d9573b",
  },
  note: { marginTop: 4, fontSize: 12, fontWeight: "600", color: "#6b7268" },
  routine: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    overflow: "hidden",
  },
  routineTop: { backgroundColor: "#edf2ec", padding: 20, alignItems: "center" },
  smallGreen: { fontSize: 13, fontWeight: "600", color: "#14453a" },
  routineTitle: { marginTop: 8, fontSize: 20, fontWeight: "700" },
  verify: {
    marginTop: 16,
    width: "100%",
    height: 35,
    borderRadius: 15,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  verifyText: { fontSize: 12, fontWeight: "700", color: "#e5f4e8" },
  routineBottom: {
    height: 42,
    backgroundColor: "#fefefe",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  deadline: { fontSize: 13, fontWeight: "700" },
  vline: { width: 1, height: 16, backgroundColor: "#e7e3d8" },
  stats: {
    height: 81,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    flexDirection: "row",
    alignItems: "center",
  },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statLabel: { fontSize: 12, fontWeight: "700" },
  statBig: {
    fontSize: 25,
    fontWeight: "900",
    color: "#14453a",
    textShadowColor: "#14453a",
    textShadowOffset: { width: 0.7, height: 0 },
    textShadowRadius: 0,
  },
  vlineTall: { width: 1, height: 47, backgroundColor: "#e7e3d8" },
  gaugeCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    padding: 16,
  },
  between: { flexDirection: "row", justifyContent: "space-between" },
  gaugeLabel: { fontSize: 13, fontWeight: "600" },
  rate: { fontSize: 20, fontWeight: "900", color: "#669884" },
  track: {
    marginTop: 12,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#efefef",
  },
  fill: {
    width: "60%",
    height: 9,
    borderRadius: 5,
    backgroundColor: "#669884",
  },
  goal: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 11,
    fontWeight: "700",
    color: "#c08a24",
  },
});
