import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';
import Icon from '@/components/common/Icon';
import { useOnboardingStore } from '@/stores/onboardingStore';

// 관심 루틴 (STEP 2). 화면은 팀원 최신 디자인(mobile/src/screens/onboarding/HabitScreen.js) 이식.
// 선택값은 계속 onboardingStore가 들고 있다가 마지막 단계에서 백엔드로 전송된다.
const items = [
  ['수분케어', '충분한 수분 섭취', 'selfcare'],
  ['운동', '꾸준한 신체 운동', 'exercise'],
  ['식사', '균형 잡힌 식단 유지', 'meal'],
  ['수면', '규칙적인 수면 패턴', 'sleep'],
];

export default function HabitsScreen() {
  const router = useRouter();
  const patch = useOnboardingStore((s) => s.patch);
  const [selected, setSelected] = useState(useOnboardingStore.getState().interests);
  const toggle = (x) => setSelected((v) => (v.includes(x) ? v.filter((i) => i !== x) : [...v, x]));

  return (
    <OnboardingShellRN
      step={2}
      total={4}
      title="어떤 루틴을 개선하고 싶나요?"
      subtitle="여러 개를 선택할 수 있어요. AI가 맞춤 그룹을 추천해드립니다."
      onBack={() => router.back()}
      onNext={() => {
        patch({ interests: selected });
        router.push('/onboarding/coach-style');
      }}
      canNext={selected.length > 0}
    >
      <View style={s.grid}>
        {items.map(([name, sub, icon]) => (
          <HabitCard
            key={name}
            name={name}
            sub={sub}
            icon={icon}
            active={selected.includes(name)}
            onPress={() => toggle(name)}
          />
        ))}
      </View>
    </OnboardingShellRN>
  );
}

function HabitCard({ name, sub, icon, active, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  const animate = (toValue) => {
    Animated.spring(scale, {
      toValue,
      speed: 32,
      bounciness: toValue === 1 ? 5 : 0,
      useNativeDriver: true,
    }).start();
  };
  // 선택되는 순간에만 아이콘이 한 번 살짝 커졌다 돌아옴.
  useEffect(() => {
    if (active) {
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.22,
          duration: 120,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [active, iconScale]);

  const iconSize = name === '운동' ? 34 : 24;
  return (
    <Animated.View style={[s.cardWrap, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animate(0.92)}
        onPressOut={() => animate(1)}
        style={[s.card, active && s.active]}
      >
        <Animated.View style={{ transform: [{ scale: iconScale }] }}>
          <Icon name={icon} size={iconSize} />
        </Animated.View>
        <Text style={s.name}>{name}</Text>
        <Text style={s.sub}>{sub}</Text>
      </Pressable>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cardWrap: { width: '48%' },
  card: {
    width: '100%',
    minHeight: 98,
    borderWidth: 2,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 4,
  },
  active: { borderColor: '#14453a', backgroundColor: '#eaf4ec' },
  name: { fontSize: 15, fontWeight: '700' },
  sub: { fontSize: 10, fontWeight: '500', color: '#4a4a4a' },
});
