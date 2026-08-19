import { useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';

import { mockGroup } from '@/data/mockGroups.js';
import { useVerificationStore } from '@/stores/verificationStore.js';

// 촬영 결과 확인 (웹 VerificationPreviewPage → expo-video 재생).
export default function PreviewScreen() {
  const router = useRouter();
  const media = useVerificationStore((s) => s.media);
  const reset = useVerificationStore((s) => s.reset);

  // 녹화 결과가 없으면 카메라로
  useEffect(() => {
    if (!media) router.replace('/verify/camera');
  }, [media]);

  const player = useVideoPlayer(media?.uri ?? null, (p) => {
    if (p) {
      p.loop = true;
      p.play();
    }
  });

  const retake = () => {
    reset();
    router.replace('/verify/camera');
  };

  if (!media) return <View className="flex-1 bg-bg" />;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="relative h-10 flex-row items-center justify-center px-5">
        <Pressable onPress={() => router.back()} className="absolute left-5 h-10 w-10 items-center justify-center rounded-xl bg-ink">
          <Text className="text-lg text-white">‹</Text>
        </Pressable>
        <Text className="text-[17px] font-bold text-ink">오늘의 인증</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-4 pt-1">
        <View className="mb-3 items-center rounded-card bg-surface p-2 shadow-sm">
          <Text className="text-[11px] font-bold text-primary">DAY {mockGroup.day}</Text>
          <Text className="text-[15px] font-bold text-ink">{mockGroup.title}</Text>
        </View>

        {/* 녹화 영상 (고정 높이 — 가이드 박스까지 한 화면에 보이도록 축소) */}
        <View className="mb-3 h-56 w-full overflow-hidden rounded-card bg-black">
          <VideoView player={player} style={{ flex: 1 }} contentFit="cover" nativeControls />
        </View>

        <View className="mb-3 rounded-card border border-line bg-primary-tint p-4">
          <Text className="mb-2 text-[15px] font-bold text-ink">인증 가이드</Text>
          <View className="gap-1.5 pl-1">
            <Text className="text-[13px] text-muted">• 오늘 촬영한 동영상만 인증 가능합니다.</Text>
            <Text className="text-[13px] text-muted">• 얼굴은 가려도 괜찮습니다.</Text>
            <Text className="text-[13px] text-muted">• 운동하는 모습이 잘 보이도록 촬영해주세요.</Text>
          </View>
        </View>

        <View className="gap-2.5">
          <Pressable onPress={() => router.replace('/verify/loading')} className="h-[48px] items-center justify-center rounded-pill bg-ink">
            <Text className="text-[15px] font-bold text-white">인증하기</Text>
          </Pressable>
          <Pressable onPress={retake} className="h-[48px] items-center justify-center rounded-pill bg-disabled">
            <Text className="text-[15px] font-bold text-white">다시 촬영하기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
