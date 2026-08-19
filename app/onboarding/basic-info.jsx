import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Svg, { Line, Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';

import OnboardingShellRN from '@/components/onboarding/OnboardingShellRN';
import { useOnboardingStore } from '@/stores/onboardingStore';

// 기본 정보 (STEP 1). 화면은 팀원 최신 디자인(mobile/src/screens/onboarding/BasicInfoScreen.js) 이식.
// 달력 피커(@react-native-community/datetimepicker)는 이 앱에 설치되어 있지 않은
// 의존성이라 가져오지 않고, 도너의 web 분기와 같은 직접 입력 방식을 유지한다.
const genders = ['여성', '남성', '선택 안함'];

export default function BasicInfoScreen() {
  const router = useRouter();
  const patch = useOnboardingStore((s) => s.patch);
  const saved = useOnboardingStore.getState();
  const birthRef = useRef(null);
  // 키·몸무게는 백엔드 프로필에 없는 필드라 전송하지 않는다(보내면 400 UNKNOWN_FIELD).
  // 화면은 그대로 두고 이 단계 안에서만 들고 있는다.
  const [form, setForm] = useState({
    nickname: saved.nickname, gender: saved.gender, birth: saved.birth, height: '', weight: '',
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const heightNum = Number(form.height);
  const weightNum = Number(form.weight);
  const heightError = form.height && (heightNum < 120 || heightNum > 250);
  const weightError = form.weight && (weightNum < 30 || weightNum > 120);
  const valid =
    form.nickname.trim() && form.birth && form.height && form.weight && !heightError && !weightError;

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
      canNext={!!valid}
    >
      <Field label="닉네임">
        <TextInput
          value={form.nickname}
          onChangeText={(v) => set('nickname', v)}
          placeholder="사용하실 닉네임을 입력해주세요."
          placeholderTextColor="#a2a2a2"
          style={s.input}
        />
      </Field>

      <Field label="성별">
        <View style={s.row}>
          {genders.map((g) => (
            <Choice key={g} text={g} active={form.gender === g} onPress={() => set('gender', g)} />
          ))}
        </View>
      </Field>

      <Field label="생년월일">
        <View style={s.dateField}>
          <TextInput
            ref={birthRef}
            value={form.birth}
            onChangeText={(v) => set('birth', v)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#8a8a8a"
            keyboardType="numbers-and-punctuation"
            style={s.dateInput}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="생년월일 입력"
            hitSlop={8}
            style={s.calendarButton}
            onPress={() => birthRef.current?.focus()}
          >
            <CalendarIcon />
          </Pressable>
        </View>
      </Field>

      <View style={s.row}>
        <Field label="키" half>
          <View style={[s.measureInput, heightError && s.measureInputError]}>
            <TextInput
              value={form.height}
              onChangeText={(v) => set('height', v.replace(/\D/g, '').slice(0, 3))}
              placeholder="165"
              placeholderTextColor="#a2a2a2"
              keyboardType="number-pad"
              style={s.measureNumber}
            />
            <Text style={s.measureUnit}>cm</Text>
          </View>
          {heightError ? <Text style={s.fieldError}>정확히 입력해주세요</Text> : null}
        </Field>
        <Field label="몸무게" half>
          <View style={[s.measureInput, weightError && s.measureInputError]}>
            <TextInput
              value={form.weight}
              onChangeText={(v) => set('weight', v.replace(/\D/g, '').slice(0, 3))}
              placeholder="50"
              placeholderTextColor="#a2a2a2"
              keyboardType="number-pad"
              style={s.measureNumber}
            />
            <Text style={s.measureUnit}>kg</Text>
          </View>
          {weightError ? <Text style={s.fieldError}>정확히 입력해주세요</Text> : null}
        </Field>
      </View>
    </OnboardingShellRN>
  );
}

function Field({ label, children, half }) {
  return (
    <View style={[s.field, half && { flex: 1 }]}>
      <Text style={s.label}>{label}</Text>
      {children}
    </View>
  );
}

function Choice({ text, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.choice, active && s.active]}>
      <Text style={s.choiceText}>{text}</Text>
    </Pressable>
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

const s = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: 12, fontWeight: '700', color: '#666' },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 14,
    fontSize: 13,
    justifyContent: 'center',
  },
  dateField: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: { flex: 1, height: '100%', paddingHorizontal: 14, fontSize: 13 },
  calendarButton: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  measureInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  measureNumber: {
    flex: 1,
    height: '100%',
    padding: 0,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  measureUnit: { width: 24, marginLeft: 4, fontSize: 13, fontWeight: '700', color: '#111' },
  measureInputError: { borderColor: '#d9573b' },
  fieldError: { marginTop: 6, fontSize: 11, fontWeight: '600', color: '#d9573b' },
  row: { flexDirection: 'row', gap: 10 },
  choice: {
    flex: 1,
    minHeight: 54,
    borderWidth: 2,
    borderColor: '#e7e3d8',
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  active: { borderColor: '#14453a', backgroundColor: '#eaf4ec' },
  choiceText: { fontSize: 14, fontWeight: '700' },
});
