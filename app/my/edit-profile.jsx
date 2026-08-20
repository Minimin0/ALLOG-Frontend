import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';

import SleepTimeDial from '../../mobile/src/components/SleepTimeDial';
import { COACH_IMAGES } from '../../mobile/src/utils/coach';
import { ApiError } from '@/services/api';
import { formatBirthInput, toIsoBirthDate } from '@/stores/onboardingStore';
import { useUserStore } from '@/stores/userStore';
import { colors } from '@/theme';
import { editFormToProfilePatch, profileToEditForm } from '@/utils/profileForm';

const genders = [['여성', 'female'], ['남성', 'male'], ['선택 안함', null]];
const coaches = [['응원형', 'supportive'], ['압박형', 'pressuring'], ['팩트형', 'fact_based'], ['유머형', 'humorous']];
const exercise = [['주 1회', 1], ['주 2회', 2], ['주 3회', 3], ['주 4회', 4], ['주 5회', 5], ['거의 안함', 0]];
const meals = [['먹지 않음', 0], ['1회', 1], ['2회', 2], ['3회 이상', 3]];
const periods = [['7일', 7], ['14일', 14], ['30일', 30]];

function localDate(value) {
  const iso = toIsoBirthDate(value);
  if (!iso) return new Date(2000, 0, 1);
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatLocalDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function Chips({ options, value, onChange, columns = 0 }) {
  return <View style={[s.chips, columns && s.chipGrid]}>{options.map(([label, option]) => (
    <Pressable key={label} onPress={() => onChange(option)} style={[s.chip, columns ? s.gridChip : s.flexChip, columns === 2 && s.twoColumn, columns === 3 && s.threeColumn, value === option && s.active]}>
      <Text style={s.chipText}>{label}</Text>
    </Pressable>
  ))}</View>;
}

function Field({ title, children, centered = false }) {
  return <View style={s.field}><Text style={[s.fieldTitle, centered && s.center]}>{title}</Text>{children}</View>;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const profile = useUserStore((state) => state.profile);
  const dirty = useRef(false);
  const [form, setForm] = useState(() => profileToEditForm(profile));
  const [loading, setLoading] = useState(!profile);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [birthPickerOpen, setBirthPickerOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile && !dirty.current) setForm(profileToEditForm(profile));
  }, [profile]);

  useEffect(() => {
    if (profile) {
      setLoading(false);
      setError('');
      return;
    }
    let active = true;
    useUserStore.getState().loadProfile().then((response) => {
      if (!active) return;
      setLoading(false);
      if (!response.ok) setError(response.errorCode === ApiError.NETWORK ? '서버에 연결할 수 없어요.' : '프로필을 불러오지 못했어요.');
    });
    return () => { active = false; };
  }, [profile]);

  const set = (key, value) => {
    dirty.current = true;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const retry = async () => {
    setLoading(true);
    setError('');
    const response = await useUserStore.getState().loadProfile();
    setLoading(false);
    if (!response.ok) setError('프로필을 불러오지 못했어요.');
  };

  const save = async () => {
    const birthDate = form.birthDate ? toIsoBirthDate(form.birthDate) : null;
    if (!form.nickname.trim()) return setError('닉네임을 입력해 주세요.');
    if (form.birthDate && !birthDate) return setError('생년월일을 YYYY-MM-DD 형식의 실제 날짜로 입력해 주세요.');
    setSaving(true);
    setError('');
    const response = await useUserStore.getState().updateProfile(editFormToProfilePatch({ ...form, birthDate }));
    setSaving(false);
    if (!response.ok) {
      setError(response.errorCode === ApiError.NETWORK ? '서버에 연결할 수 없어요.' : '프로필을 저장하지 못했어요.');
      return;
    }
    dirty.current = false;
    setSaved(true);
  };

  if (loading || (!form && !error)) return <SafeAreaView style={s.centerScreen}><ActivityIndicator color={colors.spinner} /><Text style={s.status}>프로필을 불러오는 중이에요.</Text></SafeAreaView>;
  if (!form) return <SafeAreaView style={s.centerScreen}><Text style={s.status}>{error}</Text><Pressable style={s.retry} onPress={retry}><Text style={s.buttonText}>다시 시도</Text></Pressable></SafeAreaView>;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={s.screen}>
      <View style={s.header}>
        <Pressable style={s.back} onPress={() => router.back()}><Text style={s.backText}>‹</Text></Pressable>
        <Text style={s.headerTitle}>프로필 편집</Text>
      </View>
      <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        <View style={s.profileEdit}><View style={s.avatar}><Text style={s.avatarText}>{form.nickname.trim()[0] ?? 'A'}</Text></View></View>
        <View style={s.nickname}><Text style={s.sub}>닉네임</Text><TextInput value={form.nickname} onChangeText={(value) => set('nickname', value)} maxLength={20} style={s.nicknameInput} /><Text>✎</Text></View>

        <Field title="성별"><Chips options={genders} value={form.gender} onChange={(value) => set('gender', value)} /></Field>
        <Field title="생년월일">
          <View style={s.birthField}>
            <TextInput value={form.birthDate} onChangeText={(value) => set('birthDate', formatBirthInput(value))} keyboardType="number-pad" maxLength={10} placeholder="YYYY-MM-DD" placeholderTextColor={colors.disabled} style={s.birthInput} />
            <Pressable accessibilityLabel="생년월일 달력 열기" onPress={() => setBirthPickerOpen(true)}><Text style={s.calendar}>달력</Text></Pressable>
          </View>
          {birthPickerOpen && <DateTimePicker value={localDate(form.birthDate)} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'calendar'} maximumDate={new Date()} onChange={(event, date) => { setBirthPickerOpen(false); if (event.type === 'set' && date) set('birthDate', formatLocalDate(date)); }} />}
        </Field>

        <Field title="AI 코칭"><View style={s.coaches}>{coaches.map(([label, value]) => (
          <Pressable key={value} onPress={() => set('coachStyle', value)} style={[s.coach, form.coachStyle === value && s.active]}><Image source={COACH_IMAGES[label]} style={s.coachImage} resizeMode="contain" /><Text style={s.chipText}>{label}</Text></Pressable>
        ))}</View></Field>

        <View style={s.line} />
        <Text style={[s.fieldTitle, s.center]}>수면 시간</Text>
        <View style={s.sleep}><Text style={s.sleepNumber}>{Math.floor(form.averageSleepHours)}</Text><Text>시간</Text><Text style={s.sleepNumber}>{form.averageSleepHours % 1 ? '30' : '00'}</Text><Text>분</Text></View>
        <SleepTimeDial value={form.averageSleepHours} onChange={(value) => set('averageSleepHours', value)} />
        <View style={s.line} />
        <Field title="운동 빈도" centered><Chips options={exercise} value={form.exerciseDaysPerWeek} onChange={(value) => set('exerciseDaysPerWeek', value)} columns={3} /></Field>
        <View style={s.line} />
        <Field title="식사 빈도" centered><Chips options={meals} value={form.mealsPerDay} onChange={(value) => set('mealsPerDay', value)} columns={2} /></Field>
        <View style={s.line} />
        <Field title="선호 기간" centered><Chips options={periods} value={form.preferredGroupDurationDays} onChange={(value) => set('preferredGroupDurationDays', value)} columns={3} /></Field>

        {error ? <Text style={s.error}>{error}</Text> : null}
        <Pressable disabled={saving} onPress={save} style={[s.save, saving && s.disabled]}>{saving ? <ActivityIndicator color={colors.white} /> : <Text style={s.buttonText}>저장하기</Text>}</Pressable>
      </ScrollView>

      <Modal visible={saved} transparent animationType="fade" onRequestClose={() => { setSaved(false); router.back(); }}>
        <View style={s.dim}><View style={s.savedCard}><View style={s.check}><Text style={s.checkText}>✓</Text></View><Text style={s.savedTitle}>프로필을 저장했어요!</Text><Text style={s.savedSub}>변경한 정보가 모든 화면에 바로 반영됐어요.</Text><Pressable style={s.savedButton} onPress={() => { setSaved(false); router.back(); }}><Text style={s.buttonText}>확인</Text></Pressable></View></View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg }, centerScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, backgroundColor: colors.bg }, status: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  header: { height: 67, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }, back: { width: 43, height: 43, borderRadius: 13, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' }, backText: { color: colors.white, fontSize: 30, lineHeight: 32 }, headerTitle: { fontSize: 19, fontWeight: '700' },
  content: { paddingHorizontal: 20, paddingBottom: 40, gap: 24 }, profileEdit: { alignItems: 'center' }, avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.white, fontSize: 22, fontWeight: '700' },
  nickname: { height: 52, borderRadius: 26, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }, sub: { fontSize: 12, color: colors.muted }, nicknameInput: { flex: 1, textAlign: 'center', fontSize: 15, fontWeight: '600' },
  field: { gap: 8 }, fieldTitle: { color: colors.subtle, fontSize: 13, fontWeight: '700' }, center: { textAlign: 'center' }, chips: { flexDirection: 'row', gap: 8 }, chipGrid: { flexWrap: 'wrap', gap: 12 }, chip: { minHeight: 42, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' }, flexChip: { flex: 1 }, gridChip: { height: 54 }, twoColumn: { width: '48%' }, threeColumn: { width: '30.8%' }, active: { borderWidth: 2, borderColor: colors.primary, backgroundColor: colors.primaryPale }, chipText: { fontSize: 12, fontWeight: '600' },
  birthField: { height: 48, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }, birthInput: { flex: 1, height: '100%', fontSize: 14 }, calendar: { color: colors.primary, fontSize: 13, fontWeight: '700' }, coaches: { flexDirection: 'row', gap: 8 }, coach: { flex: 1, minHeight: 78, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }, coachImage: { width: 44, height: 44 }, line: { height: 1, backgroundColor: colors.line }, sleep: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 8 }, sleepNumber: { fontSize: 28, fontWeight: '700' },
  error: { textAlign: 'center', color: colors.danger, fontSize: 12, fontWeight: '600' }, save: { height: 50, borderRadius: 27, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' }, retry: { minWidth: 140, height: 46, borderRadius: 23, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' }, disabled: { opacity: 0.5 }, buttonText: { color: colors.white, fontSize: 15, fontWeight: '700' },
  dim: { flex: 1, backgroundColor: 'rgba(0,0,0,.4)', alignItems: 'center', justifyContent: 'center', padding: 32 }, savedCard: { width: '100%', maxWidth: 330, borderRadius: 28, backgroundColor: colors.bg, padding: 26, alignItems: 'center' }, check: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, checkText: { color: colors.white, fontSize: 26, fontWeight: '700' }, savedTitle: { marginTop: 18, fontSize: 21, fontWeight: '800' }, savedSub: { marginTop: 8, textAlign: 'center', color: colors.muted, fontSize: 13 }, savedButton: { marginTop: 24, width: '100%', height: 50, borderRadius: 17, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
});
