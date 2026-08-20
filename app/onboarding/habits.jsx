import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing } from 'react-native-reanimated';
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

// 테두리는 항상 2px로 고정하고 색만 바꾼다 — 선택 시 1px→2px로 굵기가 변하면
// 박스 전체 크기가 미세하게 변해 옆/아래 카드가 밀리는 원인이 되기 때문.
function HabitCard({ label, subtitle, icon, active, onPress }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (active) {
      scale.value = withSequence(
        withTiming(1.12, { duration: 130, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 180, easing: Easing.out(Easing.quad) }),
      );
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[{ width: '47%' }, style]}>
      <Pressable
        onPress={onPress}
        className={`items-center gap-1 rounded-[15px] border-2 px-3 py-4 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}
      >
        <View className="mb-1"><Icon name={icon} size={24} /></View>
        <Text className="text-[15px] font-bold text-ink">{label}</Text>
        <Text className="text-[10px] font-medium text-subtle">{subtitle}</Text>
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
      onBack={() => router.back()}
      onNext={() => {
        patch({ interests: selected });
        router.push('/onboarding/coach-style');
      }}
      canNext={selected.length > 0}
    >
      <View className="flex-row flex-wrap gap-3">
        {habits.map((h) => (
          <HabitCard
            key={h.label}
            label={h.label}
            subtitle={h.subtitle}
            icon={h.icon}
            active={selected.includes(h.label)}
            onPress={() => toggle(h.label)}
          />
        ))}
      </View>
    </OnboardingShellRN>
  );
}
