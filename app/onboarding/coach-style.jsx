import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { COACH_IMAGES } from '../../mobile/src/utils/coach';

const coaches = [
  { name: '응원형', tone: '따뜻하게 격려해드려요', image: COACH_IMAGES['응원형'] },
  { name: '압박형', tone: '긴장감 있게 자극할게요', image: COACH_IMAGES['압박형'] },
  { name: '팩트형', tone: '숫자와 근거로 말할게요', image: COACH_IMAGES['팩트형'] },
  { name: '유머형', tone: '가볍고 재밌게 말할게요', image: COACH_IMAGES['유머형'] },
];

function CoachCard({ item, active, onPress }) {
  const imageScale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!active) return;
    Animated.sequence([
      Animated.timing(imageScale, { toValue: 1.18, duration: 130, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(imageScale, { toValue: 1, duration: 170, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [active, imageScale]);
  return (
    <Pressable onPress={onPress} style={{ width: '48%', height: 160 }} className={`items-center justify-center rounded-[15px] border-2 p-3 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
      <Animated.Image source={item.image} style={{ width: 80, height: 80, transform: [{ scale: imageScale }] }} resizeMode="contain" />
      <Text className="mt-2 text-[15px] font-bold text-ink">{item.name}</Text>
      <Text className="mt-1 text-[10px] font-medium text-subtle">{item.tone}</Text>
    </Pressable>
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
      onBack={() => router.canGoBack() ? router.back() : router.replace('/onboarding/habits')}
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
            <CoachCard key={c.name} item={c} active={active} onPress={() => setSelected(c.name)} />
          );
        })}
      </View>
    </OnboardingShellRN>
  );
}
