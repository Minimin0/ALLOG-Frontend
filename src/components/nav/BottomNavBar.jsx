import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GroupIcon, SearchIcon, HomeIcon, GiftIcon, PersonIcon } from '@/components/nav/NavIcons';

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
      className="flex-row items-end justify-around border-t border-line bg-surface px-2 pt-2"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      {ITEMS.map(({ to, label, Icon, center }) => {
        const isActive = active === to;
        const onPress = () => router.push(to);

        if (center) {
          return (
            <Pressable key={to} onPress={onPress} className="-mt-8" accessibilityLabel="홈">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#c7c3bb]">
                <Icon color="#ffffff" size={24} />
              </View>
            </Pressable>
          );
        }

        const color = isActive ? '#111111' : '#bababa';
        return (
          <Pressable key={to} onPress={onPress} className="flex-1 items-center gap-1 py-1">
            <Icon color={color} size={24} />
            <Text style={{ color, fontSize: 10, fontWeight: '700' }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
