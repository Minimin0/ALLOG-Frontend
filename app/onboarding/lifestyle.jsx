import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';
import { useOnboardingStore } from '@/stores/onboardingStore';

const EXERCISE = ['주 1회', '주 2회', '주 3회', '주 4회', '주 5회', '거의 안함'];
const MEAL = ['먹지 않음', '1회', '2회', '3회 이상'];
const PERIOD = ['7일', '14일', '30일'];

// 테두리는 항상 2px로 고정하고 색만 바꾼다 — 선택 시 굵기가 바뀌면 칩 크기가
// 미세하게 변해 옆/아래 칩이 밀리기 때문.
function Chip({ label, active, onPress, width }) {
  return (
    <Pressable onPress={onPress} style={{ width }} className={`items-center rounded-[15px] border-2 py-3 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
      <Text className={`text-[14px] font-semibold ${active ? 'text-primary' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}

function Stepper({ label, value, onDec, onInc }) {
  return (
    <View className="items-center">
      <View className="flex-row items-center gap-3">
        <Pressable onPress={onDec} className="h-8 w-8 items-center justify-center rounded-full bg-line"><Text className="text-lg text-ink">−</Text></Pressable>
        <Text className="w-10 text-center text-[26px] font-bold text-ink">{value}</Text>
        <Pressable onPress={onInc} className="h-8 w-8 items-center justify-center rounded-full bg-line"><Text className="text-lg text-ink">＋</Text></Pressable>
      </View>
      <Text className="mt-1 text-[12px] text-muted">{label}</Text>
    </View>
  );
}

export default function LifestyleScreen() {
  const router = useRouter();
  const patch = useOnboardingStore((s) => s.patch);
  const saved = useOnboardingStore.getState();
  const [form, setForm] = useState({
    sleepH: saved.sleepH, sleepM: saved.sleepM,
    exercise: saved.exercise, meal: saved.meal, period: saved.period,
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const isValid = form.exercise && form.meal && form.period;

  return (
    <OnboardingShellRN
      step={4}
      total={4}
      title="생활 패턴을 알려주세요"
      subtitle="AI가 최적의 그룹과 루틴 시간을 추천해 드려요."
      onBack={() => router.back()}
      onNext={() => {
        patch(form);
        router.push('/onboarding/complete');
      }}
      canNext={!!isValid}
    >
      <View className="gap-6">
        {/* 수면 시간 */}
        <View className="gap-3">
          <Text className="text-center text-[15px] font-bold text-ink">수면 시간</Text>
          <View className="flex-row justify-center gap-10 rounded-[15px] border border-line bg-surface px-4 py-6">
            <Stepper label="시간" value={form.sleepH} onDec={() => set('sleepH', Math.max(0, form.sleepH - 1))} onInc={() => set('sleepH', Math.min(12, form.sleepH + 1))} />
            <Stepper label="분" value={form.sleepM} onDec={() => set('sleepM', form.sleepM === 30 ? 0 : 30)} onInc={() => set('sleepM', form.sleepM === 0 ? 30 : 0)} />
          </View>
        </View>

        {/* 운동 빈도 */}
        <View className="gap-3">
          <Text className="text-center text-[15px] font-bold text-ink">운동 빈도</Text>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {EXERCISE.map((x) => <Chip key={x} label={x} active={form.exercise === x} onPress={() => set('exercise', x)} width="31%" />)}
          </View>
        </View>

        {/* 식사 빈도 */}
        <View className="gap-3">
          <Text className="text-center text-[15px] font-bold text-ink">식사 빈도</Text>
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {MEAL.map((x) => <Chip key={x} label={x} active={form.meal === x} onPress={() => set('meal', x)} width="47%" />)}
          </View>
        </View>

        {/* 선호 기간 */}
        <View className="gap-3">
          <Text className="text-center text-[15px] font-bold text-ink">선호 기간</Text>
          <View className="flex-row justify-between">
            {PERIOD.map((x) => <Chip key={x} label={x} active={form.period === x} onPress={() => set('period', x)} width="31%" />)}
          </View>
        </View>
      </View>
    </OnboardingShellRN>
  );
}
