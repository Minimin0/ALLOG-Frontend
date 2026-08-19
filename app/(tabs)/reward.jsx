import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import Icon from '@/components/common/Icon';
import AnimatedEntrance from '../../mobile/src/components/AnimatedEntrance';
import { useUserStore } from '@/stores/userStore';

// 리워드 화면. 화면 디자인은 팀원 최신본(mobile/src/screens/main/RewardScreen.js) 이식.
// 보유 포인트는 GET /users/me/stats가 authority다 — 도너의 로컬 points는 쓰지 않는다.
// 아래 상품 목록은 아직 API가 없는 정적 콘텐츠라 그대로 둔다.
const categories = ['체험', '상품', '기타', '전체'];
const sorts = ['인기 높은 순', '가격 높은 순', '가격 낮은 순'];
const rewards = [
  { id: 'serum-trial', title: 'AAC 시그니처 세럼\n체험권', cost: 1500, note: '교환 후 30일 이내 사용', icon: 'ticket' },
  { id: 'discount-15', title: '공식몰 15%\n할인 쿠폰', cost: 2000, note: '교환 후 30일 이내 사용', icon: 'coupon' },
  { id: 'free-shipping', title: '무료 배송 쿠폰\n(3만원 이상)', cost: 2000, note: '교환 후 30일 이내 사용', icon: 'shipping' },
];

export default function RewardScreen() {
  const router = useRouter();
  const points = useUserStore((s) => s.stats?.rewardPoints ?? 0);
  const [category, setCategory] = useState('전체');
  const [sort, setSort] = useState(sorts[0]);
  const [open, setOpen] = useState(false);

  const list = [...rewards].sort((a, b) =>
    sort === '가격 높은 순' ? b.cost - a.cost : sort === '가격 낮은 순' ? a.cost - b.cost : 0,
  );

  return (
    <View style={s.screen}>
      <Text className="px-[30px] pt-4 text-[28px] font-black text-ink">리워드</Text>
      <ScrollView contentContainerStyle={s.content}>
        <AnimatedEntrance style={s.balance}>
          <Text style={s.balanceLabel}>사용가능한 리워드 포인트</Text>
          <View style={s.between}>
            <View style={s.points}>
              <Icon name="coin" size={22} />
              <Text style={s.pointsText}>{points}</Text>
            </View>
            <Text style={s.link} onPress={() => Linking.openURL('https://anti-agingclub.kr/')}>
              AAC 홈페이지 바로가기
            </Text>
          </View>
          <View style={s.line} />
          <Text style={s.note}>포인트는 ACC 상품과 웰니스 혜택에만 사용돼요.</Text>
        </AnimatedEntrance>

        <View style={s.categories}>
          {categories.map((x) => (
            <Pressable key={x} style={s.category} onPress={() => setCategory(x)}>
              <Text style={[s.categoryText, category !== x && { color: '#6b7268' }]}>{x}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.sortWrap}>
          <Pressable style={s.sort} onPress={() => setOpen(!open)}>
            <Text style={s.sortText}>{sort} ⌄</Text>
          </Pressable>
          {open ? (
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
          ) : null}
        </View>

        {list.map((r, index) => {
          const afford = points >= r.cost;
          return (
            <AnimatedEntrance key={r.id} delay={index * 80}>
              <Pressable style={s.item} onPress={() => router.push(`/reward/${r.id}`)}>
                <View style={s.iconBox}>
                  <Icon name={r.icon} size={26} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.itemTitle}>{r.title}</Text>
                  <Text style={s.itemNote}>{r.note}</Text>
                  <View style={s.cost}>
                    <Icon name="coin" size={14} />
                    <Text style={s.costText}>{r.cost}</Text>
                  </View>
                </View>
                <View style={[s.badge, !afford && { backgroundColor: '#bababa' }]}>
                  <Text style={s.badgeText}>{afford ? '교환하기' : '포인트 부족'}</Text>
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
  screen: { flex: 1, backgroundColor: '#f7f6f3' },
  content: { paddingHorizontal: 30, paddingTop: 16, paddingBottom: 110, gap: 12 },
  balance: { borderRadius: 13, backgroundColor: '#4a3a18', padding: 20, elevation: 8 },
  balanceLabel: { fontSize: 15, fontWeight: '600', color: '#e7e3d8' },
  between: { marginTop: 8, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  points: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pointsText: { fontSize: 30, fontWeight: '700', color: '#e7e3d8' },
  link: { fontSize: 12, fontWeight: '700', color: '#fefefe' },
  line: { height: 1, backgroundColor: 'rgba(231,227,216,.3)', marginVertical: 12 },
  note: { fontSize: 10, color: '#e7e3d8' },
  categories: { flexDirection: 'row', gap: 10, marginTop: 8 },
  category: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#fefefe',
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 1,
  },
  categoryText: { fontSize: 13, fontWeight: '600' },
  sortWrap: { alignItems: 'flex-end', zIndex: 3 },
  sort: { borderRadius: 6, backgroundColor: '#e7e3d8', paddingHorizontal: 14, paddingVertical: 6 },
  sortText: { fontSize: 13, fontWeight: '600', color: '#696973' },
  menu: {
    position: 'absolute',
    right: 0,
    top: 36,
    width: 132,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingVertical: 4,
    elevation: 8,
  },
  menuItem: { paddingHorizontal: 14, paddingVertical: 10 },
  menuText: { fontSize: 12, fontWeight: '600' },
  item: {
    borderRadius: 13,
    backgroundColor: '#fefefe',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#f3efe4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitle: { fontSize: 15, fontWeight: '700' },
  itemNote: { marginTop: 4, fontSize: 10, color: '#6b7268' },
  cost: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 4 },
  costText: { fontSize: 15, fontWeight: '700' },
  badge: { borderRadius: 99, backgroundColor: '#000', paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
});
