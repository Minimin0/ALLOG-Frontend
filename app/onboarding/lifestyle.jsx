import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';
import { useOnboardingStore } from '@/stores/onboardingStore';
import SleepTimeDial from '../../mobile/src/components/SleepTimeDial';

const EXERCISE = ['주 1회', '주 2회', '주 3회', '주 4회', '주 5회', '거의 안함'];
const MEAL = ['먹지 않음', '1회', '2회', '3회 이상'];
const PERIOD = ['7일', '14일', '30일'];

function Chip({ label, active, onPress, width }) {
  return (
    <Pressable onPress={onPress} style={{ width }} className={`items-center rounded-[15px] border py-3 ${active ? 'border-2 border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
      <Text className={`text-[14px] font-semibold ${active ? 'text-primary' : 'text-ink'}`}>{label}</Text>
    </Pressable>
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
  const sleep = form.sleepH + form.sleepM / 60;
  const setSleep = (value) => setForm((current) => ({ ...current, sleepH: Math.floor(value), sleepM: value % 1 ? 30 : 0 }));
  const isValid = form.exercise && form.meal && form.period;

  return (
    <OnboardingShellRN
      step={4}
      total={4}
      title="생활 패턴을 알려주세요"
      subtitle="AI가 최적의 그룹과 루틴 시간을 추천해 드려요."
      onBack={() => router.canGoBack() ? router.back() : router.replace('/onboarding/coach-style')}
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
          <View className="relative h-[191px] flex-row items-start justify-center gap-1.5 rounded-[15px] border border-line bg-surface pt-6">
            <Text className="text-[33px] font-bold text-ink">{Math.floor(sleep)}</Text>
            <Text className="mr-2.5 mt-[18px] text-[13px] text-muted">시간</Text>
            <Text className="text-[33px] font-bold text-ink">{sleep % 1 ? '30' : '00'}</Text>
            <Text className="mt-[18px] text-[13px] text-muted">분</Text>
            <View className="absolute bottom-[18px] left-px right-px h-[92px]">
              <SleepTimeDial value={sleep} onChange={setSleep} min={0} max={24} />
            </View>
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
