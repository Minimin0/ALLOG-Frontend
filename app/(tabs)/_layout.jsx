import { View, Text, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GroupIcon, SearchIcon, HomeIcon, GiftIcon, PersonIcon } from '@/components/nav/NavIcons';

// 하단 탭 (웹 BottomNav 포팅). 가운데 홈은 원형으로 띄운다.
// 활성=ink(#111), 비활성=disabled(#bababa).
const TAB_ITEMS = [
  { name: 'group', label: '내 그룹', Icon: GroupIcon },
  { name: 'explore', label: '탐색', Icon: SearchIcon },
  { name: 'home', label: '홈', Icon: HomeIcon, center: true },
  { name: 'reward', label: '리워드', Icon: GiftIcon },
  { name: 'my', label: '마이 페이지', Icon: PersonIcon },
];

function AllogTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const activeName = state.routes[state.index]?.name;

  return (
    <View
      className="flex-row items-end justify-around border-t border-line bg-surface px-2 pt-2"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      {TAB_ITEMS.map(({ name, label, Icon, center }) => {
        const isActive = activeName === name;
        const onPress = () => navigation.navigate(name);

        if (center) {
          return (
            <Pressable key={name} onPress={onPress} className="-mt-8" accessibilityLabel="홈">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#c7c3bb]">
                <Icon color="#ffffff" size={24} />
              </View>
            </Pressable>
          );
        }

        const color = isActive ? '#111111' : '#bababa';
        return (
          <Pressable key={name} onPress={onPress} className="flex-1 items-center gap-1 py-1">
            <Icon color={color} size={24} />
            <Text style={{ color, fontSize: 10, fontWeight: '700' }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <AllogTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="group" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="reward" />
      <Tabs.Screen name="my" />
    </Tabs>
  );
}
