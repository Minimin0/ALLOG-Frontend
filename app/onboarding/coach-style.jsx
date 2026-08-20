import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing } from 'react-native-reanimated';
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

// 테두리를 항상 2px로 고정하고 색만 바꾼다 — 굵기가 바뀌면 카드 크기가 미세하게
// 변해 옆 카드가 밀리기 때문.
function CoachCard({ name, tone, icon, active, onPress }) {
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
    <Animated.View style={[{ width: '47%', height: 160 }, style]}>
      <Pressable
        onPress={onPress}
        className={`h-full items-center justify-center rounded-[15px] border-2 px-3 py-3 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}
      >
        <View className="mb-2"><Icon name={icon} size={72} /></View>
        <Text className="text-[15px] font-bold text-ink">{name}</Text>
        <Text className="mt-1 text-[10px] font-medium text-subtle">{tone}</Text>
      </Pressable>
    </Animated.View>
  );
}

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
        {coaches.map((c) => (
          <CoachCard
            key={c.name}
            name={c.name}
            tone={c.tone}
            icon={c.icon}
            active={selected === c.name}
            onPress={() => setSelected(c.name)}
          />
        ))}
      </View>
    </OnboardingShellRN>
  );
}
