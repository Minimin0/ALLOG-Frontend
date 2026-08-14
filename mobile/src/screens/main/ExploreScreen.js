import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Search from "../../../assets/images/SearchIcon.svg";
import Filter from "../../../assets/images/FilterIcon.svg";
import AnimatedEntrance from "../../components/AnimatedEntrance";
import CoachMascotButton from "../../components/CoachMascotButton";
const categories = ["전체", "수분케어", "식사", "운동", "수면"];
const groups = [
  {
    id: "water-evening",
    title: "저녁형 수분 루틴",
    members: "3/5명",
    duration: "14일",
    status: "모집중",
  },
  {
    id: "water-morning",
    title: "아침 물 챌린지",
    members: "4/5명",
    duration: "7일",
    status: "모집중",
  },
  {
    id: "water-worker",
    title: "직장인 수분 루틴",
    members: "5/5명",
    duration: "30일",
    status: "정원 충족",
    full: true,
  },
];
export default function ExploreScreen({ navigation }) {
  const [category, setCategory] = useState("수분케어"),
    [join, setJoin] = useState(null),
    [filter, setFilter] = useState(false),
    [duration, setDuration] = useState("전체"),
    [status, setStatus] = useState("전체"),
    [appliedDuration, setAppliedDuration] = useState("전체"),
    [appliedStatus, setAppliedStatus] = useState("전체");
  const list = useMemo(
    () =>
      groups.filter(
        (g) =>
          (appliedDuration === "전체" || g.duration === appliedDuration) &&
          (appliedStatus === "전체" || g.status === appliedStatus),
      ),
    [appliedDuration, appliedStatus],
  );
  const openFilter = () => {
    setDuration(appliedDuration);
    setStatus(appliedStatus);
    setFilter(true);
  };
  const confirmJoin = () => {
    const [current, total] = (join.members || "4/5명")
      .replace("명", "")
      .split("/")
      .map(Number);
    setJoin(null);
    navigation.navigate(current + 1 >= total ? "GroupDetail" : "JoinComplete", {
      title: join.title,
      capacity: total,
      existingCount: current,
    });
  };
  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.title}>탐색</Text>
        <CoachMascotButton
          source={require("../../../assets/images/CheerCoach.png")}
          onPress={() => navigation.navigate("AiCoach")}
        />
      </View>
      <ScrollView contentContainerStyle={s.content}>
        <View style={s.searchRow}>
          <View style={s.search}>
            <Search width={16} height={16} />
            <TextInput
              placeholder="그룹 또는 루틴 검색..."
              style={s.searchInput}
            />
          </View>
          <Pressable style={s.filter} onPress={openFilter}>
            <Filter width={18} height={18} />
            {(appliedDuration !== "전체" || appliedStatus !== "전체") && (
              <View style={s.dot} />
            )}
          </Pressable>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.categories}
        >
          {categories.map((x) => (
            <Pressable
              key={x}
              onPress={() => setCategory(x)}
              style={[s.chip, category === x && s.chipOn]}
            >
              <Text style={[s.chipText, category === x && s.chipTextOn]}>
                {x}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <AnimatedEntrance style={s.ai}>
          <View style={{ flex: 1 }}>
            <Text style={s.aiHint}>
              <Text style={{ fontWeight: "700", color: "#000" }}>AI 추천 </Text>
              곧 마감돼요, 자리 1개 남았어요
            </Text>
            <Text style={s.aiTitle}>매일 물 1.5L 마시기</Text>
            <Text style={s.meta}>
              4/5명 <Text style={s.heart}>♥</Text> 1개{" "}
              <Text style={{ fontWeight: "700" }}>모집중</Text>
            </Text>
          </View>
          <Pressable
            style={s.join}
            onPress={() =>
              setJoin({ title: "매일 물 1.5L 마시기", members: "4/5명" })
            }
          >
            <Text style={s.joinText}>참가</Text>
          </Pressable>
        </AnimatedEntrance>
        <Text style={s.section}>모집중인 그룹</Text>
        {list.length === 0 ? (
          <Text style={s.empty}>조건에 맞는 그룹이 없어요.</Text>
        ) : (
          list.map((g, index) => (
            <AnimatedEntrance key={g.id} delay={index * 70} style={s.group}>
              <View style={{ flex: 1 }}>
                <Text style={[s.groupTitle, g.full && s.muted]}>{g.title}</Text>
                <Text style={[s.groupMeta, g.full && s.muted]}>
                  {g.members} <Text style={s.heart}>♥</Text> 1개 필요
                </Text>
              </View>
              <Pressable
                disabled={g.full}
                style={[s.groupButton, g.full && s.full]}
                onPress={() => setJoin(g)}
              >
                <Text
                  style={[s.groupButtonText, g.full && { color: "#d9573b" }]}
                >
                  {g.full ? "마감" : "참가"}
                </Text>
              </Pressable>
            </AnimatedEntrance>
          ))
        )}
        <Text style={s.question}>하고싶은 루틴이 없다면?</Text>
        <Pressable
          style={s.create}
          onPress={() => navigation.navigate("CreateGroup")}
        >
          <Text style={s.createText}>직접 그룹 만들기</Text>
        </Pressable>
        <Text style={s.code} onPress={() => navigation.navigate("JoinByCode")}>
          이미 초대 코드가 있나요? 코드로 참여하기
        </Text>
      </ScrollView>
      <Modal visible={!!join} transparent animationType="fade">
        <Pressable style={s.dim} onPress={() => setJoin(null)} />
        <View style={s.dialog}>
          <Text style={s.dialogTitle}>{join?.title}</Text>
          <Text style={s.dialogText}>하트 1개를 사용해 그룹에 참가할까요?</Text>
          <View style={s.dialogRow}>
            <Pressable style={s.cancel} onPress={() => setJoin(null)}>
              <Text>취소</Text>
            </Pressable>
            <Pressable style={s.confirm} onPress={confirmJoin}>
              <Text style={s.createText}>참가</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal visible={filter} transparent animationType="slide">
        <Pressable style={s.dim} onPress={() => setFilter(false)} />
        <View style={s.sheet}>
          <Text style={s.dialogTitle}>필터</Text>
          <Text style={s.section}>기간</Text>
          <View style={s.dialogRow}>
            {["전체", "7일", "14일", "30일"].map((x) => (
              <Pressable
                key={x}
                style={[s.filterChip, duration === x && s.chipOn]}
                onPress={() => setDuration(x)}
              >
                <Text style={duration === x ? s.chipTextOn : null}>{x}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={s.section}>모집 상태</Text>
          <View style={s.dialogRow}>
            {["전체", "모집중", "정원 충족"].map((x) => (
              <Pressable
                key={x}
                style={[s.filterChip, status === x && s.chipOn]}
                onPress={() => setStatus(x)}
              >
                <Text style={status === x ? s.chipTextOn : null}>{x}</Text>
              </Pressable>
            ))}
          </View>
          <View style={s.dialogRow}>
            <Pressable
              style={s.cancel}
              onPress={() => {
                setDuration("전체");
                setStatus("전체");
              }}
            >
              <Text>초기화</Text>
            </Pressable>
            <Pressable
              style={[s.create, { flex: 2 }]}
              onPress={() => {
                setAppliedDuration(duration);
                setAppliedStatus(status);
                setFilter(false);
              }}
            >
              <Text style={s.createText}>적용하기</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f3" },
  header: {
    paddingHorizontal: 30,
    paddingTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontSize: 28, fontWeight: "700" },
  content: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 35,
    gap: 12,
  },
  searchRow: { flexDirection: "row", gap: 8 },
  search: {
    height: 45,
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#6b7268" },
  filter: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    right: 6,
    top: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#d9573b",
  },
  categories: { gap: 6 },
  chip: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipOn: { borderColor: "#000", backgroundColor: "#000" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#6b7268" },
  chipTextOn: { color: "#fff" },
  ai: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#edf2ec",
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  aiHint: { fontSize: 11, color: "#14453a" },
  aiTitle: { marginTop: 8, fontSize: 16, fontWeight: "700" },
  meta: { marginTop: 8, fontSize: 12, fontWeight: "600" },
  heart: { color: "#d9573b" },
  join: {
    borderRadius: 12,
    backgroundColor: "#14453a",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  joinText: { fontSize: 12, fontWeight: "700", color: "#fff" },
  section: { fontSize: 13, fontWeight: "700", marginTop: 4 },
  group: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fefefe",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  groupTitle: { fontSize: 15, fontWeight: "700", color: "#1f2a24" },
  groupMeta: { marginTop: 6, fontSize: 12, color: "#6b7268" },
  muted: { color: "#bababa" },
  groupButton: {
    borderRadius: 12,
    backgroundColor: "#edf2ec",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  full: { backgroundColor: "#f9ddd7", opacity: 0.4 },
  groupButtonText: { fontSize: 12, fontWeight: "700", color: "#1f3d2b" },
  empty: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    backgroundColor: "#fff",
    padding: 16,
    textAlign: "center",
    fontSize: 13,
    color: "#6b7268",
  },
  question: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 13,
    color: "#6b7268",
  },
  create: {
    height: 50,
    borderRadius: 27.5,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  createText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  code: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7268",
    textDecorationLine: "underline",
  },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,.4)" },
  dialog: {
    position: "absolute",
    left: 30,
    right: 30,
    top: "35%",
    borderRadius: 22,
    backgroundColor: "#fff",
    padding: 22,
  },
  dialogTitle: { fontSize: 20, fontWeight: "700" },
  dialogText: { fontSize: 14, color: "#6b7268", marginVertical: 16 },
  dialogRow: { flexDirection: "row", gap: 10, marginTop: 14 },
  cancel: {
    flex: 1,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#e7e3d8",
    alignItems: "center",
    justifyContent: "center",
  },
  confirm: {
    flex: 1,
    height: 48,
    borderRadius: 18,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#fff",
    padding: 24,
    paddingBottom: 35,
  },
  filterChip: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: "#e7e3d8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
