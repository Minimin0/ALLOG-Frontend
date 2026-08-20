import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';
import FieldError from '@/components/common/FieldError';
import { formatBirthInput, toIsoBirthDate, useOnboardingStore } from '@/stores/onboardingStore';
import { colors } from '@/theme';

const genders = ['여성', '남성', '선택 안함'];

function localDate(value) {
  const iso = toIsoBirthDate(value);
  if (!iso) return new Date();
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatLocalDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function BasicInfoScreen() {
  const router = useRouter();
  const patch = useOnboardingStore((s) => s.patch);
  const saved = useOnboardingStore.getState();
  // 키·몸무게는 백엔드 프로필에 없는 필드라 전송하지 않는다(보내면 400 UNKNOWN_FIELD).
  // 화면은 그대로 두고 이 단계 안에서만 들고 있는다.
  const [form, setForm] = useState({
    nickname: saved.nickname, gender: saved.gender, birth: saved.birth, height: '', weight: '',
  });
  const [birthPickerOpen, setBirthPickerOpen] = useState(false);
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  // 서버는 birthDate를 LocalDate로 파싱한다. 형식이 어긋난 값을 들고 다음 단계로
  // 넘어가면 온보딩을 다 끝낸 뒤에야 400을 보게 되므로 여기서 막는다.
  const birthIso = toIsoBirthDate(form.birth);
  const isValid = form.nickname.trim() && birthIso && form.height && form.weight;

  return (
    <OnboardingShellRN
      step={1}
      total={4}
      title="기본 정보를 입력해주세요."
      subtitle="입력하신 정보로 맞춤 루틴을 추천해드려요."
      onBack={() => router.back()}
      onNext={() => {
        patch({ nickname: form.nickname, gender: form.gender, birth: form.birth });
        router.push('/onboarding/habits');
      }}
      nextLabel="다음 단계로"
      canNext={!!isValid}
    >
      <View className="gap-4">
        <View>
          <Text className="mb-2 text-[13px] font-bold text-subtle">닉네임</Text>
          <TextInput value={form.nickname} onChangeText={(v) => set('nickname', v)} placeholder="사용하실 닉네임을 입력해주세요." placeholderTextColor={colors.disabled}
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
          <View className="flex-row gap-2">
            <TextInput value={form.birth} onChangeText={(v) => set('birth', formatBirthInput(v))} placeholder="YYYY-MM-DD" placeholderTextColor={colors.disabled} keyboardType="number-pad" maxLength={10}
              className="h-11 flex-1 rounded-[15px] border border-line bg-surface px-4 text-[15px] text-ink" />
            <Pressable
              onPress={() => setBirthPickerOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="생년월일 달력 열기"
              className="h-11 items-center justify-center rounded-[15px] border border-line bg-surface px-4"
            >
              <Text className="text-[13px] font-bold text-primary">달력</Text>
            </Pressable>
          </View>
          {birthPickerOpen && (
            <DateTimePicker
              value={localDate(form.birth)}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, date) => {
                setBirthPickerOpen(false);
                if (event.type === 'set' && date) set('birth', formatLocalDate(date));
              }}
            />
          )}
          <FieldError>{form.birth && !birthIso ? '생년월일을 YYYY-MM-DD 형식의 실제 날짜로 입력해주세요.' : null}</FieldError>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-2 text-[13px] font-bold text-subtle">키</Text>
            <View className="h-11 flex-row items-center rounded-[15px] border border-line bg-surface px-4">
              <TextInput value={form.height} onChangeText={(v) => set('height', v)} placeholder="165" placeholderTextColor={colors.disabled} keyboardType="number-pad" className="flex-1 text-center text-[15px] text-ink" />
              <Text className="text-[12px] text-subtle">cm</Text>
            </View>
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-[13px] font-bold text-subtle">몸무게</Text>
            <View className="h-11 flex-row items-center rounded-[15px] border border-line bg-surface px-4">
              <TextInput value={form.weight} onChangeText={(v) => set('weight', v)} placeholder="50" placeholderTextColor={colors.disabled} keyboardType="number-pad" className="flex-1 text-center text-[15px] text-ink" />
              <Text className="text-[12px] text-subtle">kg</Text>
            </View>
          </View>
        </View>
      </View>
    </OnboardingShellRN>
  );
}
