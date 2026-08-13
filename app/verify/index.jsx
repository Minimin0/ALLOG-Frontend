import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { mockGroup } from '@/data/mockGroups.js';
import { useVerificationStore } from '@/stores/verificationStore.js';

// 오늘의 인증(시작) 화면 (웹 VerificationPage 포팅).
export default function VerifyStartScreen() {
  const router = useRouter();
  const reset = useVerificationStore((s) => s.reset);

  const goCamera = () => {
    reset();
    router.push('/verify/camera');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      {/* 헤더 */}
      <View className="relative h-10 flex-row items-center justify-center px-5">
        <Pressable onPress={() => router.back()} className="absolute left-5 h-10 w-10 items-center justify-center rounded-xl bg-ink">
          <Text className="text-lg text-white">‹</Text>
        </Pressable>
        <Text className="text-[17px] font-bold text-ink">오늘의 인증</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-6 pt-2">
        {/* DAY 카드 */}
        <View className="mx-auto w-[86%] items-center rounded-card bg-surface p-5 shadow-sm">
          <Text className="text-[12px] font-bold text-primary">DAY {mockGroup.day}</Text>
          <Text className="text-[22px] font-bold text-ink">{mockGroup.title}</Text>
        </View>

        {/* 촬영 영역 (탭 → 카메라) */}
        <Pressable onPress={goCamera} className="mt-5 h-[320px] items-center justify-center gap-3 rounded-card bg-line">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-surface">
            <Text className="text-2xl">🎥</Text>
          </View>
          <Text className="text-[15px] font-medium text-ink">동영상 촬영</Text>
        </Pressable>

        {/* 인증 가이드 */}
        <View className="mt-5 rounded-card bg-primary-tint p-5">
          <Text className="mb-3 text-[17px] font-bold text-ink">인증 가이드</Text>
          <View className="gap-2">
            <Text className="text-[15px] text-muted">• 오늘 촬영한 동영상만 인증 가능합니다.</Text>
            <Text className="text-[15px] text-muted">• 얼굴은 가려도 괜찮습니다.</Text>
            <Text className="text-[15px] text-muted">• 운동하는 모습이 잘 보이도록 촬영해주세요.</Text>
          </View>
          <View className="mt-3 flex-row items-center gap-2 rounded-item bg-surface px-3 py-2">
            <Text>🎬</Text>
            <Text className="text-[11px] text-muted">기록은 <Text className="font-bold text-primary">3초 내외 짧은 동영상</Text>으로 저장돼요.</Text>
          </View>
        </View>

        {/* 인증하기 */}
        <Pressable onPress={goCamera} className="mt-5 h-[52px] items-center justify-center rounded-pill bg-primary">
          <Text className="text-[15px] font-bold text-white">인증하기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
