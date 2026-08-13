import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';

const habits = [
  { label: '수분케어', subtitle: '충분한 수분 섭취', emoji: '💧' },
  { label: '운동', subtitle: '꾸준한 신체 운동', emoji: '🏃' },
  { label: '식사', subtitle: '균형 잡힌 식단 유지', emoji: '🍽️' },
  { label: '수면', subtitle: '규칙적인 수면 패턴', emoji: '😴' },
];

export default function HabitsScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const toggle = (l) => setSelected((p) => (p.includes(l) ? p.filter((x) => x !== l) : [...p, l]));

  return (
    <OnboardingShellRN
      step={2}
      total={4}
      title="어떤 루틴을 개선하고 싶나요?"
      subtitle="여러 개를 선택할 수 있어요. AI가 맞춤 그룹을 추천해드립니다."
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/coach-style')}
      canNext={selected.length > 0}
    >
      <View className="flex-row flex-wrap gap-3">
        {habits.map((h) => {
          const active = selected.includes(h.label);
          return (
            <Pressable
              key={h.label}
              onPress={() => toggle(h.label)}
              style={{ width: '47%' }}
              className={`items-center gap-1 rounded-[15px] border px-3 py-4 ${active ? 'border-2 border-primary bg-primary-pale' : 'border-line bg-surface'}`}
            >
              <Text className="mb-1 text-2xl">{h.emoji}</Text>
              <Text className="text-[15px] font-bold text-ink">{h.label}</Text>
              <Text className="text-[10px] font-medium text-subtle">{h.subtitle}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingShellRN>
  );
}
