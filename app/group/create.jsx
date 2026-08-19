import { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ApiError } from '@/services/api';
import { createGroup, fetchRoutineCatalog } from '@/services/groupApi';
import { useUserStore } from '@/stores/userStore';

// 그룹 만들기. 생성자는 OWNER로 참가하며 하트 1개를 쓴다 — 차감은 전부 백엔드가 한다.
// 그룹 도메인 enum은 UPPERCASE다 (PUBLIC/PRIVATE, DAILY).
const categories = [
  { label: '수분케어', key: 'HYDRATION' },
  { label: '식사', key: 'MEAL' },
  { label: '운동', key: 'EXERCISE' },
  { label: '수면', key: 'SLEEP' },
];
const durations = ['7일', '14일', '30일'];

// 서비스 기준 달력은 Asia/Seoul(UTC+9, DST 없음)이다. Intl 없이 그 날짜를 만든다.
function seoulDate(offsetDays = 0) {
  return new Date(Date.now() + 9 * 3600000 + offsetDays * 86400000).toISOString().slice(0, 10);
}

export default function CreateGroupScreen() {
  const router = useRouter();
  const [catalog, setCatalog] = useState([]);
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('14일');
  const [capacity, setCapacity] = useState(5);
  const [visibility, setVisibility] = useState('public');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // routineDefinitionId는 환경마다 다르므로 하드코딩하지 않고 GET /api/v1/routines에서 받는다.
  useEffect(() => {
    fetchRoutineCatalog().then((response) => {
      if (response.ok) setCatalog(response.data?.items ?? []);
      else setError('루틴 목록을 불러오지 못했어요.');
    });
  }, []);

  const canSubmit = category && name.trim().length > 0 && catalog.length > 0 && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    const key = categories.find((c) => c.label === category)?.key;
    const routine = catalog.find((r) => r.routineKey === key);
    if (!routine) {
      setError('이 카테고리의 루틴을 찾지 못했어요.');
      return;
    }

    const days = Number.parseInt(duration, 10);
    setBusy(true);
    setError('');

    const response = await createGroup({
      routineDefinitionId: routine.routineDefinitionId,
      name: name.trim(),
      visibility: visibility === 'private' ? 'PRIVATE' : 'PUBLIC',
      maxMembers: capacity,
      // 개인 목표 70%는 온보딩 안내와 홈 게이지가 쓰는 것과 같은 기준이다.
      requiredCompletionCount: Math.max(1, Math.round(days * 0.7)),
      // 사진 인증 템플릿은 지금 식사 루틴 하나만 승인돼 있다. 그 외에는 기록형 그룹으로 만든다.
      verificationTemplateKey: key === 'MEAL' ? 'MEAL_PHOTO_RECORD' : null,
      schedule: {
        scheduleType: 'DAILY',
        startDate: seoulDate(),
        endDate: seoulDate(days - 1),
        deadlineTime: '23:00:00',
        timezone: 'Asia/Seoul',
        specificDays: [],
      },
    });
    setBusy(false);

    if (response.ok) {
      await useUserStore.getState().loadStats();
      const groupId = String(response.data?.groupId ?? '');
      // 비공개 그룹은 초대 코드가 있어야 참가할 수 있으므로 바로 코드 화면으로 보낸다.
      router.replace(
        visibility === 'private'
          ? { pathname: '/group/invite', params: { groupId } }
          : { pathname: '/group/created', params: { groupId } },
      );
      return;
    }

    if (response.errorCode === ApiError.INSUFFICIENT_HEARTS) setError('하트가 부족해요. 하트를 먼저 얻어주세요.');
    else if (response.errorCode === ApiError.NETWORK) setError('서버에 연결할 수 없어요.');
    else if (response.errorCode === ApiError.VALIDATION) setError('입력값을 다시 확인해주세요.');
    else setError('그룹을 만들지 못했어요. 잠시 후 다시 시도해주세요.');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-ink">
          <Text className="text-[28px] leading-[32px] text-white">‹</Text>
        </Pressable>
        <Text className="text-[19px] font-bold text-ink">그룹 만들기</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-6 pb-8">
        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">카테고리 선택</Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((c) => {
              const active = category === c.label;
              return (
                <Pressable key={c.label} onPress={() => setCategory(c.label)} className={`rounded-full border px-4 py-2 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
                  <Text className={`text-[13px] font-semibold ${active ? 'text-ink' : 'text-subtle'}`}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">그룹명</Text>
          <TextInput value={name} onChangeText={setName} placeholder="매일 물 2L 마시기" placeholderTextColor="#bababa"
            className="rounded-[15px] border border-line bg-surface px-4 py-4 text-[14px] text-ink" />
        </View>

        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">진행기간</Text>
          <View className="flex-row gap-3">
            {durations.map((d) => {
              const active = duration === d;
              return (
                <Pressable key={d} onPress={() => setDuration(d)} className={`flex-1 items-center rounded-[15px] border py-3 ${active ? 'border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
                  <Text className={`text-[14px] font-bold ${active ? 'text-ink' : 'text-subtle'}`}>{d}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">참여 인원</Text>
          <View className="flex-row items-center justify-between rounded-[15px] border border-line bg-surface px-4 py-4">
            <Pressable onPress={() => setCapacity((p) => Math.max(2, p - 1))} className="h-8 w-8 items-center justify-center rounded-full bg-[#f0eee8]"><Text className="text-lg font-bold text-ink">−</Text></Pressable>
            <Text className="text-[16px] font-bold text-ink">{capacity}명</Text>
            <Pressable onPress={() => setCapacity((p) => Math.min(10, p + 1))} className="h-8 w-8 items-center justify-center rounded-full bg-[#f0eee8]"><Text className="text-lg font-bold text-ink">＋</Text></Pressable>
          </View>
        </View>

        <View>
          <Text className="mb-2 text-[15px] font-bold text-ink">공개 범위</Text>
          <View className="flex-row gap-3">
            {[
              { key: 'public', title: '공개', note: '누구나 참여할 수 있어요.' },
              { key: 'private', title: '비공개', note: '초대한 사람만 참여할 수 있어요.' },
            ].map((v) => {
              const active = visibility === v.key;
              return (
                <Pressable key={v.key} onPress={() => setVisibility(v.key)} className={`flex-1 items-center rounded-[15px] border px-3 py-4 ${active ? 'border-2 border-primary bg-primary-pale' : 'border-line bg-surface'}`}>
                  <Text className="text-[14px] font-bold text-ink">{v.title}</Text>
                  <Text className="mt-1 text-center text-[11px] font-medium text-subtle">{v.note}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {error ? <Text className="text-center text-[13px] font-semibold text-danger">{error}</Text> : null}

        <Pressable
          onPress={submit}
          disabled={!canSubmit}
          className={`items-center justify-center rounded-[27.5px] py-4 ${canSubmit ? 'bg-ink' : 'bg-ink opacity-40'}`}
        >
          {busy ? <ActivityIndicator color="#fff" /> : <Text className="text-[15px] font-bold text-white">그룹 만들기 (♥ 1개 사용)</Text>}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
