import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RewardIcon from "../../../assets/images/RewardIcon.svg";
import TrialIcon from "../../../assets/images/TrialIcon.svg";
import DiscountIcon from "../../../assets/images/DiscountIcon.svg";
import ShippingIcon from "../../../assets/images/ShippingIcon.svg";
import { useAppState } from "../../state/AppState";
import AnimatedEntrance from "../../components/AnimatedEntrance";
const rewards = [
  {
    id: "serum-trial",
    title: "AAC 시그니처 세럼\n체험권",
    cost: 1500,
    note: "교환 후 30일 이내 사용",
    Icon: TrialIcon,
  },
  {
    id: "discount-15",
    title: "공식몰 15%\n할인 쿠폰",
    cost: 2000,
    note: "교환 후 30일 이내 사용",
    Icon: DiscountIcon,
  },
  {
    id: "free-shipping",
    title: "무료 배송 쿠폰\n(3만원 이상)",
    cost: 2000,
    note: "교환 후 30일 이내 사용",
    Icon: ShippingIcon,
  },
];
const categories = ["체험", "상품", "기타", "전체"],
  sorts = ["인기 높은 순", "가격 높은 순", "가격 낮은 순"];
export default function RewardScreen({ navigation }) {
  const { points } = useAppState();
  const [category, setCategory] = useState("전체"),
    [sort, setSort] = useState(sorts[0]),
    [open, setOpen] = useState(false);
  const list = [...rewards].sort((a, b) =>
    sort === "가격 높은 순"
      ? b.cost - a.cost
      : sort === "가격 낮은 순"
        ? a.cost - b.cost
        : 0,
  );
  return (
    <View style={s.screen}>
      <Text className="px-[30px] pt-4 text-[28px] font-black text-ink">리워드</Text>
      <ScrollView contentContainerStyle={s.content}>
        <AnimatedEntrance style={s.balance}>
          <Text style={s.balanceLabel}>사용가능한 리워드 포인트</Text>
          <View style={s.between}>
            <View style={s.points}>
              <RewardIcon width={22} height={22} />
              <Text style={s.pointsText}>{points}</Text>
            </View>
            <Text
              style={s.link}
              onPress={() => Linking.openURL("https://anti-agingclub.kr/")}
            >
              AAC 홈페이지 바로가기
            </Text>
          </View>
          <View style={s.line} />
          <Text style={s.note}>
            포인트는 ACC 상품과 웰니스 혜택에만 사용돼요.
          </Text>
        </AnimatedEntrance>
        <View style={s.categories}>
          {categories.map((x) => (
            <Pressable
              key={x}
              style={s.category}
              onPress={() => setCategory(x)}
            >
              <Text
                style={[s.categoryText, category !== x && { color: "#6b7268" }]}
              >
                {x}
              </Text>
            </Pressable>
          ))}
        </View>
        <View style={s.sortWrap}>
          <Pressable style={s.sort} onPress={() => setOpen(!open)}>
            <Text style={s.sortText}>{sort} ⌄</Text>
          </Pressable>
          {open && (
            <View style={s.menu}>
              {sorts.map((x) => (
                <Pressable
                  key={x}
                  onPress={() => {
                    setSort(x);
                    setOpen(false);
                  }}
                  style={s.menuItem}
                >
                  <Text style={s.menuText}>{x}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
        {list.map((r, index) => {
          const afford = points >= r.cost;
          const ItemIcon = r.Icon;
          return (
            <AnimatedEntrance key={r.id} delay={index * 80}>
              <Pressable
                style={s.item}
                onPress={() =>
                  navigation.navigate("RewardDetail", {
                    reward: {
                      id: r.id,
                      title: r.title,
                      cost: r.cost,
                      note: r.note,
                    },
                  })
                }
              >
                <View style={s.iconBox}>
                  <ItemIcon width={26} height={26} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.itemTitle}>{r.title}</Text>
                  <Text style={s.itemNote}>{r.note}</Text>
                  <View style={s.cost}>
                    <RewardIcon width={14} height={14} />
                    <Text style={s.costText}>{r.cost}</Text>
                  </View>
                </View>
                <View
                  style={[s.badge, !afford && { backgroundColor: "#bababa" }]}
                >
                  <Text style={s.badgeText}>
                    {afford ? "교환하기" : "포인트 부족"}
                  </Text>
                </View>
              </Pressable>
            </AnimatedEntrance>
          );
        })}
      </ScrollView>
    </View>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f3" },
  content: {
    paddingHorizontal: 30,
    paddingTop: 16,
    paddingBottom: 35,
    gap: 12,
  },
  balance: {
    borderRadius: 13,
    backgroundColor: "#4a3a18",
    padding: 20,
    elevation: 8,
  },
  balanceLabel: { fontSize: 15, fontWeight: "600", color: "#e7e3d8" },
  between: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  points: { flexDirection: "row", alignItems: "center", gap: 6 },
  pointsText: { fontSize: 30, fontWeight: "700", color: "#e7e3d8" },
  link: { fontSize: 12, fontWeight: "700", color: "#fefefe" },
  line: {
    height: 1,
    backgroundColor: "rgba(231,227,216,.3)",
    marginVertical: 12,
  },
  note: { fontSize: 10, color: "#e7e3d8" },
  categories: { flexDirection: "row", gap: 10, marginTop: 8 },
  category: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#fefefe",
    paddingVertical: 10,
    alignItems: "center",
    elevation: 1,
  },
  categoryText: { fontSize: 13, fontWeight: "600" },
  sortWrap: { alignItems: "flex-end", zIndex: 3 },
  sort: {
    borderRadius: 6,
    backgroundColor: "#e7e3d8",
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  sortText: { fontSize: 13, fontWeight: "600", color: "#696973" },
  menu: {
    position: "absolute",
    right: 0,
    top: 36,
    width: 132,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingVertical: 4,
    elevation: 8,
  },
  menuItem: { paddingHorizontal: 14, paddingVertical: 10 },
  menuText: { fontSize: 12, fontWeight: "600" },
  item: {
    borderRadius: 13,
    backgroundColor: "#fefefe",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#f3efe4",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 25 },
  itemTitle: { fontSize: 15, fontWeight: "700" },
  itemNote: { marginTop: 4, fontSize: 10, color: "#6b7268" },
  cost: { marginTop: 6, flexDirection: "row", alignItems: "center", gap: 4 },
  costText: { fontSize: 15, fontWeight: "700" },
  badge: {
    borderRadius: 99,
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#fff" },
});
