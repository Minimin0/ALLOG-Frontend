import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';
import Icon from '@/components/common/Icon';
import { useOnboardingStore } from '@/stores/onboardingStore';

const habits = [
  { label: '수분케어', subtitle: '충분한 수분 섭취', icon: 'selfcare' },
  { label: '운동', subtitle: '꾸준한 신체 운동', icon: 'exercise' },
  { label: '식사', subtitle: '균형 잡힌 식단 유지', icon: 'meal' },
  { label: '수면', subtitle: '규칙적인 수면 패턴', icon: 'sleep' },
];

function HabitCard({ item, active, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const iconScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active) return;
    Animated.sequence([
      Animated.timing(iconScale, { toValue: 1.22, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(iconScale, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [active, iconScale]);
  const press = (toValue) => Animated.spring(scale, { toValue, speed: 32, bounciness: toValue === 1 ? 5 : 0, useNativeDriver: true }).start();
  return (
    <Animated.View style={{ width: '48%', transform: [{ scale }] }}>
      <Pressable onPress={onPress} onPressIn={() => press(0.92)} onPressOut={() => press(1)} className={`min-h-[98px] items-center justify-center gap-1 rounded-[15px] border-2 p-3 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
        <Animated.View style={{ transform: [{ scale: iconScale }] }}><Icon name={item.icon} size={item.label === '운동' ? 34 : 24} /></Animated.View>
        <Text className="text-[15px] font-bold text-ink">{item.label}</Text>
        <Text className="text-[10px] font-medium text-subtle">{item.subtitle}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function HabitsScreen() {
  const router = useRouter();
  const patch = useOnboardingStore((s) => s.patch);
  const [selected, setSelected] = useState(useOnboardingStore.getState().interests);
  const toggle = (l) => setSelected((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));

  return (
    <OnboardingShellRN
      step={2}
      total={4}
      title="어떤 루틴을 개선하고 싶나요?"
      subtitle="여러 개를 선택할 수 있어요. AI가 맞춤 그룹을 추천해드립니다."
      onBack={() => router.replace('/onboarding/basic-info')}
      onNext={() => {
        patch({ interests: selected });
        router.push('/onboarding/coach-style');
      }}
      canNext={selected.length > 0}
    >
      <View className="flex-row flex-wrap gap-3">
        {habits.map((h) => {
          const active = selected.includes(h.label);
          return (
            <HabitCard key={h.label} item={h} active={active} onPress={() => toggle(h.label)} />
          );
        })}
      </View>
    </OnboardingShellRN>
  );
}
