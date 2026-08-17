import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';
import FieldError from '@/components/common/FieldError';

const genders = ['여성', '남성', '선택 안함'];
const HEIGHT_MIN = 120;
const HEIGHT_MAX = 250;
const WEIGHT_MIN = 30;
const WEIGHT_MAX = 120;

export default function BasicInfoScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ nickname: '', gender: '여성', birth: '', height: '', weight: '' });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const heightError = form.height && (Number(form.height) < HEIGHT_MIN || Number(form.height) > HEIGHT_MAX)
    ? `${HEIGHT_MIN}~${HEIGHT_MAX}cm 사이로 정확히 입력해주세요`
    : '';
  const weightError = form.weight && (Number(form.weight) < WEIGHT_MIN || Number(form.weight) > WEIGHT_MAX)
    ? `${WEIGHT_MIN}~${WEIGHT_MAX}kg 사이로 정확히 입력해주세요`
    : '';
  const isValid = form.nickname.trim() && form.birth && form.height && form.weight && !heightError && !weightError;

  return (
    <OnboardingShellRN
      step={1}
      total={4}
      title="기본 정보를 입력해주세요."
      subtitle="입력하신 정보로 맞춤 루틴을 추천해드려요."
      onBack={() => router.back()}
      onNext={() => router.push('/onboarding/habits')}
      nextLabel="다음 단계로"
      canNext={!!isValid}
    >
      <View className="gap-4">
        <View>
          <Text className="mb-2 text-[13px] font-bold text-subtle">닉네임</Text>
          <TextInput value={form.nickname} onChangeText={(v) => set('nickname', v)} placeholder="사용하실 닉네임을 입력해주세요." placeholderTextColor="#bababa"
            className="h-11 rounded-[15px] border border-line bg-surface px-4 text-[15px] text-ink" />
        </View>

        <View>
          <Text className="mb-2 text-[13px] font-bold text-subtle">성별</Text>
          <View className="flex-row gap-3">
            {genders.map((g) => {
              const active = form.gender === g;
              return (
                <Pressable key={g} onPress={() => set('gender', g)} className={`flex-1 items-center rounded-[15px] border py-3 ${active ? 'border-2 border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
                  <Text className={`text-[14px] font-bold ${active ? 'text-primary' : 'text-ink'}`}>{g}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text className="mb-2 text-[13px] font-bold text-subtle">생년월일</Text>
          <TextInput value={form.birth} onChangeText={(v) => set('birth', v)} placeholder="YYYY-MM-DD" placeholderTextColor="#bababa" keyboardType="numbers-and-punctuation"
            className="h-11 rounded-[15px] border border-line bg-surface px-4 text-[15px] text-ink" />
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-2 text-[13px] font-bold text-subtle">키</Text>
            <View className={`h-11 flex-row items-center rounded-[15px] border bg-surface px-4 ${heightError ? 'border-danger' : 'border-line'}`}>
              <TextInput value={form.height} onChangeText={(v) => set('height', v.replace(/\D/g, '').slice(0, 3))} placeholder="165" placeholderTextColor="#bababa" keyboardType="number-pad" className="flex-1 text-center text-[15px] text-ink" />
              <Text className="text-[12px] text-subtle">cm</Text>
            </View>
            <FieldError>{heightError}</FieldError>
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-[13px] font-bold text-subtle">몸무게</Text>
            <View className={`h-11 flex-row items-center rounded-[15px] border bg-surface px-4 ${weightError ? 'border-danger' : 'border-line'}`}>
              <TextInput value={form.weight} onChangeText={(v) => set('weight', v.replace(/\D/g, '').slice(0, 3))} placeholder="50" placeholderTextColor="#bababa" keyboardType="number-pad" className="flex-1 text-center text-[15px] text-ink" />
              <Text className="text-[12px] text-subtle">kg</Text>
            </View>
            <FieldError>{weightError}</FieldError>
          </View>
        </View>
      </View>
    </OnboardingShellRN>
  );
}
