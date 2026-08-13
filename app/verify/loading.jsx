import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useVerificationStore } from '@/stores/verificationStore.js';

const MOCK_RESULT = 'success'; // 'success' | 'retry'
const CHECK_ITEMS = [
  { emoji: '🖼️', title: '영상 품질 확인', sub: '선명도와 구도 확인' },
  { emoji: '🚩', title: '챌린지 일치 여부 확인', sub: '챌린지 조건 확인' },
  { emoji: '🕐', title: '촬영 시간 확인', sub: '오늘 촬영된 동영상인지 확인' },
  { emoji: '🧩', title: '중복 이미지 검사', sub: '이전에 제출한 사진과 비교' },
];

// AI 분석 화면 (웹 VerificationLoadingPage 포팅). 4개 항목이 순차 완료 → 결과로.
export default function LoadingScreen() {
  const router = useRouter();
  const setResult = useVerificationStore((s) => s.setResult);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= CHECK_ITEMS.length) {
      setResult(MOCK_RESULT);
      const t = setTimeout(() => router.replace('/verify/result'), 400);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg px-5">
      <View className="mt-6 items-center">
        {/* 마스코트 + 스피너 (conic 링은 Batch 6에서 SVG로) */}
        <View className="h-44 w-44 items-center justify-center rounded-full bg-primary-tint">
          <Text className="text-6xl">🌱</Text>
        </View>
        <View className="mt-6">
          <ActivityIndicator size="small" color="#14453a" />
        </View>

        <Text className="mt-4 text-center text-[20px] font-bold text-ink">AI 가 인증 내용을 분석하고 있어요.</Text>
        <Text className="mt-2 text-center text-[20px] font-medium text-muted">잠시만 기다려주세요.</Text>
      </View>

      {/* 검사 항목 카드 */}
      <View className="mt-8 rounded-[35px] border border-line bg-surface px-2">
        {CHECK_ITEMS.map((item, i) => {
          const done = i < step;
          const loading = i === step;
          return (
            <View
              key={item.title}
              className={`flex-row items-center gap-3 px-3 py-4 ${i < CHECK_ITEMS.length - 1 ? 'border-b border-line' : ''}`}
            >
              <Text className="text-xl">{item.emoji}</Text>
              <View className="flex-1">
                <Text className="text-[15px] font-semibold text-ink">{item.title}</Text>
                <Text className="text-[10px] font-medium text-muted">{item.sub}</Text>
              </View>
              {done ? (
                <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Text className="text-xs text-white">✓</Text>
                </View>
              ) : loading ? (
                <ActivityIndicator size="small" color="#14453a" />
              ) : (
                <View className="h-6 w-6 rounded-full border-2 border-line" />
              )}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
