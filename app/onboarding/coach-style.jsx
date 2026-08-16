import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';
import Icon from '@/components/common/Icon';
import { useOnboardingStore } from '@/stores/onboardingStore';

const coaches = [
  { name: '응원형', tone: '따뜻하게 격려해드려요', icon: 'coach' },
  { name: '압박형', tone: '긴장감 있게 자극할게요', icon: 'pressure' },
  { name: '팩트형', tone: '숫자와 근거로 말할게요', icon: 'fact' },
  { name: '유머형', tone: '가볍고 재밌게 말할게요', icon: 'humor' },
];

export default function CoachStyleScreen() {
  const router = useRouter();
  const patch = useOnboardingStore((s) => s.patch);
  const [selected, setSelected] = useState(useOnboardingStore.getState().coachStyle);

  return (
    <OnboardingShellRN
      step={3}
      total={4}
      title="어떤 방식으로 응원받고 싶나요?"
      subtitle="선택한 스타일로 AI 코치가 매일 말을 걸어드려요."
      onBack={() => router.back()}
      onNext={() => {
        patch({ coachStyle: selected });
        router.push('/onboarding/lifestyle');
      }}
      canNext={!!selected}
    >
      <View className="flex-row flex-wrap gap-3">
        {coaches.map((c) => {
          const active = selected === c.name;
          return (
            <Pressable
              key={c.name}
              onPress={() => setSelected(c.name)}
              style={{ width: '47%', height: 160 }}
              className={`items-center justify-center rounded-[15px] border px-3 py-3 ${active ? 'border-2 border-primary bg-primary-pale' : 'border-line bg-surface'}`}
            >
              <View className="mb-2"><Icon name={c.icon} size={72} /></View>
              <Text className="text-[15px] font-bold text-ink">{c.name}</Text>
              <Text className="mt-1 text-[10px] font-medium text-subtle">{c.tone}</Text>
            </Pressable>
          );
        })}
      </View>
    </OnboardingShellRN>
  );
}
