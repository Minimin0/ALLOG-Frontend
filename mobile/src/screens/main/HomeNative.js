import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import Heart from "../../../assets/images/HeartIcon.svg";
import Reward from "../../../assets/images/RewardIcon.svg";
import Chart from "../../../assets/images/ChartIcon.svg";
import Fire from "../../../assets/images/FireIcon.svg";
import { useAppState } from "../../state/AppState";
import { getCoachImage } from "../../utils/coach";
import AnimatedEntrance from "../../components/AnimatedEntrance";
import CoachMascotButton from "../../components/CoachMascotButton";
export default function HomeNative({ navigation }) {
  const { coachStyle, points, hearts, verifiedToday } = useAppState();
  const isFocused = useIsFocused();
  const gauge = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    gauge.stopAnimation();
    gauge.setValue(0);
    if (!isFocused) return undefined;
    const animation = Animated.timing(gauge, {
      toValue: 0.6,
      delay: 150,
      duration: 1000,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [gauge, isFocused]);
  const coachImage = getCoachImage(coachStyle);
  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text className="text-[28px] font-black text-ink">홈</Text>
        <CoachMascotButton
          source={coachImage}
          onPress={() => navigation.navigate("AiCoach")}
        />
      </View>
      <ScrollView contentContainerStyle={s.content}>
        <AnimatedEntrance style={s.row}>
          <Card
            icon={<Heart width={21} height={19} />}
            value={String(hearts)}
            label="보유 하트"
            note="하트 얻으러 가기 >"
            onPress={() => navigation.navigate("HeartEvent")}
          />
          <Card
            icon={<Reward width={18} height={18} />}
            value={String(points)}
            label="포인트"
            labelColor="#c08a24"
            note="포인트 혜택 보러가기 >"
            onPress={() => navigation.navigate("Reward")}
          />
        </AnimatedEntrance>
        <AnimatedEntrance delay={60} style={s.routine}>
          <View style={s.routineTop}>
            <Text style={s.smallGreen}>오늘의 루틴</Text>
            <Text style={s.routineTitle}>하루 운동 30분</Text>
            <Pressable
              disabled={verifiedToday}
              style={[s.verify, verifiedToday && s.verifyDone]}
              onPress={() => navigation.navigate("Camera")}
            >
              <Text style={s.verifyText}>
                {verifiedToday ? "인증 완료" : "인증하러 가기"}
              </Text>
            </Pressable>
          </View>
          <View style={s.routineBottom}>
            <Text style={s.deadline}>마감 오후 10:00</Text>
            <View style={s.vline} />
            <Text style={s.deadline}>3시간 12분 남음</Text>
          </View>
        </AnimatedEntrance>
        <AnimatedEntrance delay={120}>
          <Pressable
            style={s.stats}
            onPress={() => navigation.navigate("My")}
          >
            <View style={s.stat}>
              <View style={s.inline}>
                <Chart width={16} height={16} />
                <Text style={s.statLabel}>개인 순위</Text>
              </View>
              <View style={s.statValueRow}>
                <Text style={s.statBig}>2</Text>
                <Text style={s.statLabel}> 위 / 5명</Text>
              </View>
            </View>
            <View style={s.vlineTall} />
            <View style={s.stat}>
              <View style={s.inline}>
                <Fire width={16} height={16} />
                <Text style={s.statLabel}>연속 성공</Text>
              </View>
              <View style={s.statValueRow}>
                <Text style={s.statBig}>3</Text>
                <Text style={s.daySuffix}> 일째</Text>
              </View>
            </View>
          </Pressable>
        </AnimatedEntrance>
        <AnimatedEntrance delay={180} style={s.gaugeCard}>
          <View style={s.between}>
            <Text style={s.gaugeLabel}>개인 성공률</Text>
            <Text style={s.rate}>60%</Text>
          </View>
          <View style={s.track}>
            <Animated.View
              style={[
                s.fill,
                {
                  width: gauge.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
            <View style={s.goalMarker}>
              <Text style={s.goalMarkerText}>▲</Text>
            </View>
          </View>
          <Text style={s.goal}>개인 목표 70%</Text>
        </AnimatedEntrance>
      </ScrollView>
    </View>
  );
}
function Card({ icon, value, label, labelColor, note, onPress }) {
  return (
    <Pressable style={s.card} onPress={onPress}>
      <View style={s.inline}>
        {icon}
        <Text style={s.value}>{value}</Text>
      </View>
      <Text style={[s.cardLabel, labelColor && { color: labelColor }]}>
        {label}
      </Text>
      <Text style={s.note}>{note}</Text>
    </Pressable>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f3" },
  header: {
    paddingHorizontal: 30,
    paddingTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  routineTop: {
    backgroundColor: "#edf2ec",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    alignItems: "center",
  },
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
  verifyDone: { backgroundColor: "#bababa" },
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
  statValueRow: { flexDirection: "row", alignItems: "baseline" },
  statLabel: { fontSize: 12, fontWeight: "700" },
  statBig: {
    fontFamily: Platform.OS === "android" ? "sans-serif-black" : "Pretendard",
    fontSize: 25,
    fontWeight: "900",
    color: "#14453a",
    textShadowColor: "#14453a",
    textShadowOffset: { width: 0.7, height: 0 },
    textShadowRadius: 0,
  },
  daySuffix: { fontSize: 12, fontWeight: "700" },
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
    position: "relative",
    marginTop: 12,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#efefef",
  },
  fill: {
    height: 9,
    borderRadius: 5,
    backgroundColor: "#669884",
  },
  goalMarker: {
    position: "absolute",
    top: 13,
    left: "70%",
    transform: [{ translateX: -5 }],
  },
  goalMarkerText: {
    fontSize: 10,
    lineHeight: 10,
    color: "#c08a24",
  },
  goal: {
    marginTop: 8,
    textAlign: "right",
    fontSize: 11,
    fontWeight: "700",
    color: "#c08a24",
  },
});
