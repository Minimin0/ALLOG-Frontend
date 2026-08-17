import { useState } from 'react';
import { Platform, View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Svg, { Line, Path, Rect } from 'react-native-svg';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';

const genders = ['여성', '남성', '선택 안함'];

export default function BasicInfoScreen() {
  const router = useRouter();
  const [form, setForm] = useState({ nickname: '', gender: '여성', birth: '', height: '', weight: '' });
  const [dateOpen, setDateOpen] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const isValid = form.nickname.trim() && form.birth && form.height && form.weight;

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
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="생년월일 달력 열기"
            onPress={() => setDateOpen(true)}
            className="h-11 flex-row items-center rounded-[15px] border border-line bg-surface pl-4"
          >
            <Text className={`flex-1 text-[15px] ${form.birth ? 'text-ink' : 'text-[#bababa]'}`}>
              {form.birth || 'YYYY-MM-DD'}
            </Text>
            <View className="h-11 w-11 items-center justify-center">
              <CalendarIcon />
            </View>
          </Pressable>
          {dateOpen ? (
            <DateTimePicker
              value={form.birth ? new Date(`${form.birth}T00:00:00`) : new Date(2000, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setDateOpen(false);
                if (event.type === 'set' && selectedDate) {
                  const year = selectedDate.getFullYear();
                  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
                  const day = String(selectedDate.getDate()).padStart(2, '0');
                  set('birth', `${year}-${month}-${day}`);
                }
              }}
            />
          ) : null}
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-2 text-[13px] font-bold text-subtle">키</Text>
            <View className="h-11 flex-row items-center rounded-[15px] border border-line bg-surface px-4">
              <TextInput value={form.height} onChangeText={(v) => set('height', v)} placeholder="165" placeholderTextColor="#bababa" keyboardType="number-pad" className="flex-1 text-center text-[15px] text-ink" />
              <Text className="text-[12px] text-subtle">cm</Text>
            </View>
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-[13px] font-bold text-subtle">몸무게</Text>
            <View className="h-11 flex-row items-center rounded-[15px] border border-line bg-surface px-4">
              <TextInput value={form.weight} onChangeText={(v) => set('weight', v)} placeholder="50" placeholderTextColor="#bababa" keyboardType="number-pad" className="flex-1 text-center text-[15px] text-ink" />
              <Text className="text-[12px] text-subtle">kg</Text>
            </View>
          </View>
        </View>
      </View>
    </OnboardingShellRN>
  );
}

function CalendarIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Rect x={2} y={3.5} width={16} height={14.5} rx={3} fill="none" stroke="#14453a" strokeWidth={1.7} />
      <Line x1={2} y1={8} x2={18} y2={8} stroke="#14453a" strokeWidth={1.7} />
      <Path d="M6 2 L6 5 M14 2 L14 5" stroke="#14453a" strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}
