import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Exercise from "../../../assets/images/ExerciseIcon.svg";
import Sleep from "../../../assets/images/SleepIcon.svg";
import Meal from "../../../assets/images/MealIcon.svg";
import Care from "../../../assets/images/SelfCareIcon.svg";
import Heart from "../../../assets/images/HeartIcon.svg";
import Reward from "../../../assets/images/RewardIcon.svg";
import Bell from "../../../assets/images/BellIcon.svg";
import Privacy from "../../../assets/images/PrivacyIcon.svg";
import Terms from "../../../assets/images/TermsIcon.svg";
import Support from "../../../assets/images/SupportIcon.svg";
import { useAppState } from "../../state/AppState";
import AnimatedEntrance from "../../components/AnimatedEntrance";
const records = [
    ["운동", "3회", Exercise],
    ["수면", "5회", Sleep],
    ["식사", "4회", Meal],
    ["셀프케어", "1회", Care],
  ],
  menus = [
    ["알림 설정", "Notifications", Bell],
    ["개인정보 보호", "Privacy", Privacy],
    ["이용약관", "Terms", Terms],
    ["고객센터", "Support", Support],
  ];
export default function MyScreen({ navigation }) {
  const { nickname, points } = useAppState();
  return (
    <View style={s.screen}>
      <Text className="px-[30px] pt-4 text-[28px] font-black text-ink">마이 페이지</Text>
      <ScrollView contentContainerStyle={s.content}>
        <AnimatedEntrance style={s.profile}>
          <View style={s.profileRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{nickname.charAt(0) || "A"}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{nickname}</Text>
              <Text style={s.email}>minzi@gmail.com</Text>
            </View>
            <Pressable
              style={s.edit}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <Text style={s.editText}>편집</Text>
            </Pressable>
          </View>
          <View style={s.line} />
          <View style={s.metrics}>
            <Metric label="하트" value="3" Icon={Heart} red />
            <Metric label="리워드" value={String(points)} Icon={Reward} />
            <Metric label="성공한 루틴" value="13회" />
          </View>
        </AnimatedEntrance>
        <AnimatedEntrance delay={60} style={s.recordSection}>
          <Text style={s.section}>내 기록</Text>
          <View style={s.records}>
            {records.map(([name, count, Icon]) => (
              <View key={name} style={s.record}>
                <View style={s.recordIcon}>
                  <Icon width={24} height={24} />
                </View>
                <Text style={s.recordName}>{name}</Text>
                <Text style={s.recordCount}>{count}</Text>
              </View>
            ))}
          </View>
        </AnimatedEntrance>
        <AnimatedEntrance delay={120} style={s.menus}>
          {menus.map(([label, route, Icon], i) => (
            <Pressable
              key={label}
              style={[s.menu, i > 0 && s.menuLine]}
              onPress={() => navigation.navigate(route)}
            >
              <Icon width={18} height={18} />
              <Text style={s.menuText}>{label}</Text>
              <Text style={s.arrow}>›</Text>
            </Pressable>
          ))}
        </AnimatedEntrance>
        <Pressable style={s.logout}>
          <Text style={s.logoutText}>로그아웃</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
function Metric({ label, value, Icon, red }) {
  return (
    <View style={s.metric}>
      <Text style={[s.metricLabel, red && { color: "#d9573b" }]}>{label}</Text>
      <View style={s.metricValue}>
        {Icon && <Icon width={13} height={13} />}
        <Text style={s.metricValueText}>{value}</Text>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f3" },
  content: {
    paddingHorizontal: 30,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 20,
  },
  profile: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    padding: 20,
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: "#fff" },
  name: { fontSize: 18, fontWeight: "700" },
  email: { marginTop: 2, fontSize: 12, color: "#6b7268" },
  edit: {
    borderRadius: 99,
    backgroundColor: "#e5f4e8",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  editText: { fontSize: 12, fontWeight: "700" },
  line: { height: 1, backgroundColor: "#e7e3d8", marginVertical: 16 },
  metrics: { flexDirection: "row" },
  metric: { flex: 1, alignItems: "center" },
  metricLabel: { fontSize: 10, fontWeight: "600", color: "#6b7268" },
  metricValue: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metricValueText: { fontSize: 15, fontWeight: "700" },
  recordSection: { gap: 10 },
  section: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700",
    color: "#6b7268",
  },
  records: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    padding: 16,
    flexDirection: "row",
    gap: 8,
  },
  record: { flex: 1, alignItems: "center" },
  recordIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#f3efe4",
    alignItems: "center",
    justifyContent: "center",
  },
  recordName: { marginTop: 8, fontSize: 11, lineHeight: 13, fontWeight: "600" },
  recordCount: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: "700",
    color: "#14453a",
  },
  menus: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    overflow: "hidden",
  },
  menu: {
    height: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLine: { borderTopWidth: 1, borderTopColor: "#e7e3d8" },
  menuText: { flex: 1, fontSize: 13, fontWeight: "500" },
  arrow: { fontSize: 18, color: "#bababa" },
  logout: {
    height: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#d9573b",
    backgroundColor: "#fefefe",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: { fontSize: 15, fontWeight: "700", color: "#d9573b" },
});
