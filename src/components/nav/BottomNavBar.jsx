import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GroupIcon, SearchIcon, HomeIcon, GiftIcon, PersonIcon } from '@/components/nav/NavIcons';
import { colors } from '@/theme';

// 탭 밖 화면(인증 시작·AI 코칭 등)에서도 쓰는 독립 하단 네비바.
// (tabs) 레이아웃의 탭바와 동일 디자인, 누르면 해당 탭으로 이동.
const ITEMS = [
  { to: '/group', label: '내 그룹', Icon: GroupIcon },
  { to: '/explore', label: '탐색', Icon: SearchIcon },
  { to: '/home', label: '홈', Icon: HomeIcon, center: true },
  { to: '/reward', label: '리워드', Icon: GiftIcon },
  { to: '/my', label: '마이 페이지', Icon: PersonIcon },
];

export default function BottomNavBar({ active }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.bar, { height: 80 + insets.bottom, paddingBottom: 10 + insets.bottom }]}
    >
      {ITEMS.map(({ to, label, Icon, center }) => {
        const isActive = active === to;
        const onPress = () => router.push(to);

        if (center) {
          return (
            <Pressable key={to} onPress={onPress} style={styles.item} accessibilityLabel="홈">
              <View style={styles.home}>
                <Icon color={colors.white} size={26} />
              </View>
            </Pressable>
          );
        }

        const color = isActive ? colors.ink : colors.disabled;
        return (
          <Pressable key={to} onPress={onPress} style={styles.item}>
            <Icon color={color} size={routeIconSize(to)} />
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function routeIconSize(to) {
  if (to === '/group') return 30;
  if (to === '/explore' || to === '/my') return 27;
  return 29;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 10,
    backgroundColor: colors.white,
    elevation: 12,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
  },
  home: {
    width: 62,
    height: 62,
    marginTop: -30,
    borderRadius: 31,
    borderWidth: 8,
    borderColor: colors.white,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
