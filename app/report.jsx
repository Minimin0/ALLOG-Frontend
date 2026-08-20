import { useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';

// 재인증 요청 · 신고 (웹 ReportPage 포팅). 사유(필수)+상세 → 접수.
const REASONS = [
  { id: 'not-activity', label: '운동/활동이 확인되지 않아요' },
  { id: 'wrong-day', label: '오늘 촬영이 아닌 것 같아요' },
  { id: 'inappropriate', label: '부적절한 내용이에요' },
  { id: 'etc', label: '기타' },
];

export default function ReportScreen() {
  const router = useRouter();
  const [reasonId, setReasonId] = useState(null);
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = reasonId !== null && (reasonId !== 'etc' || detail.trim().length > 0);

  if (submitted) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center gap-4 bg-bg p-6">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-success"><Text className="text-3xl text-white">✓</Text></View>
        <Text className="text-[22px] font-bold text-ink">접수됐어요</Text>
        <Text className="text-[15px] text-muted">검토 후 결과를 알려드릴게요.</Text>
        <Pressable onPress={() => router.back()} className="mt-2 rounded-pill bg-black px-6 py-3"><Text className="font-bold text-white">돌아가기</Text></Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-row items-center gap-2 px-5 py-3">
        <Pressable onPress={() => router.back()} className="h-8 w-8 items-center justify-center"><Text className="text-2xl text-ink">‹</Text></Pressable>
        <Text className="text-[22px] font-bold text-ink">재인증 요청 · 신고</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-6">
        <Text className="mb-4 text-[15px] text-muted">사유를 선택해 주세요.</Text>

        <View className="mb-5 gap-2">
          {REASONS.map((r) => {
            const sel = reasonId === r.id;
            return (
              <Pressable key={r.id} onPress={() => setReasonId(r.id)} className={`flex-row items-center gap-3 rounded-item border px-4 py-3 ${sel ? 'border-primary bg-primary-tint' : 'border-line bg-surface'}`}>
                <View className={`h-5 w-5 items-center justify-center rounded-full border-2 ${sel ? 'border-primary' : 'border-disabled'}`}>
                  {sel && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </View>
                <Text className={`text-[15px] ${sel ? 'font-semibold text-ink' : 'text-subtle'}`}>{r.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="mb-2 text-[11px] font-semibold text-ink">상세 내용 {reasonId === 'etc' && <Text className="text-danger">*</Text>}</Text>
        <TextInput
          value={detail}
          onChangeText={setDetail}
          placeholder="구체적인 내용을 적어주세요 (선택)"
          placeholderTextColor={colors.disabled}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="min-h-[100px] rounded-item border border-line bg-surface p-3 text-[15px] text-ink"
        />
      </ScrollView>

      <View className="px-5 pb-4">
        <Pressable onPress={() => canSubmit && setSubmitted(true)} disabled={!canSubmit} className={`h-[52px] items-center justify-center rounded-pill ${canSubmit ? 'bg-black' : 'bg-disabled'}`}>
          <Text className="text-[15px] font-bold text-white">제출하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
