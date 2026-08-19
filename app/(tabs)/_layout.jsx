import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

function GroupTabIcon({ color }) {
  return (
    <Svg width={30} height={26} viewBox="0 0 30 26">
      <Circle cx={11} cy={7} r={5} fill={color} />
      <Circle cx={23} cy={8} r={4} fill={color} opacity={0.82} />
      <Path d="M1 25 C1 18 5 14 11 14 C17 14 21 18 21 25 Z" fill={color} />
      <Path d="M20 16 C26 16 29 19 29 25 L23 25 C23 21 22 18 20 16 Z" fill={color} opacity={0.82} />
    </Svg>
  );
}

function ExploreTabIcon({ color }) {
  return (
    <Svg width={27} height={27} viewBox="0 0 27 27">
      <Circle cx={11} cy={11} r={8.5} fill="none" stroke={color} strokeWidth={4} />
      <Line x1={17.5} y1={17.5} x2={25} y2={25} stroke={color} strokeWidth={4} strokeLinecap="round" />
    </Svg>
  );
}

function RewardTabIcon({ color }) {
  return (
    <Svg width={29} height={27} viewBox="0 0 29 27">
      <Rect x={2} y={9} width={25} height={16} rx={3} fill={color} />
      <Rect x={0} y={6} width={29} height={7} rx={3} fill={color} />
      <Rect x={13} y={6} width={3} height={19} fill="#ffffff" />
      <Path d="M14 6 C8 -1 4 1 5 4 C6 7 10 7 14 6 Z M15 6 C21 -1 25 1 24 4 C23 7 19 7 15 6 Z" fill={color} />
    </Svg>
  );
}

function MyTabIcon({ color }) {
  return (
    <Svg width={27} height={27} viewBox="0 0 27 27">
      <Circle cx={13.5} cy={7} r={6} fill={color} />
      <Path d="M1 27 C1 18 6 14 13.5 14 C21 14 26 18 26 27 Z" fill={color} />
    </Svg>
  );
}

const icons = { group: GroupTabIcon, explore: ExploreTabIcon, reward: RewardTabIcon, my: MyTabIcon };

export default function TabsLayout() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <Tabs
        initialRouteName="home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: s.bar,
          tabBarLabelStyle: s.label,
          tabBarActiveTintColor: '#000',
          tabBarInactiveTintColor: '#bababa',
          tabBarIcon: ({ color }) => {
            if (route.name === 'home') {
              return (
                <View style={[s.home, { backgroundColor: color === '#000' ? '#000' : '#bababa' }]}>
                  <Svg width={26} height={28} viewBox="0 0 24 24">
                    <Path fill="#ffffff" d="M2 10.5 L12 2 L22 10.5 L20.4 12.4 L19 11.2 L19 22 L14 22 L14 15 L10 15 L10 22 L5 22 L5 11.2 L3.6 12.4 Z" />
                  </Svg>
                </View>
              );
            }
            const Icon = icons[route.name];
            return Icon ? <Icon color={color} /> : null;
          },
        })}
      >
        <Tabs.Screen name="group" options={{ title: '내 그룹' }} />
        <Tabs.Screen name="explore" options={{ title: '탐색' }} />
        <Tabs.Screen name="home" options={{ title: '홈', tabBarLabel: '' }} />
        <Tabs.Screen name="reward" options={{ title: '리워드' }} />
        <Tabs.Screen name="my" options={{ title: '마이 페이지' }} />
      </Tabs>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f6f3' },
  bar: {
    height: 80,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 12,
  },
  label: { marginTop: 2, fontSize: 12, fontWeight: '700' },
  home: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
    borderWidth: 8,
    borderColor: '#fff',
  },
});
