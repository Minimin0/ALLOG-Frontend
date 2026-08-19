import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';

import { useGroupStore } from '@/stores/groupStore';
import { useVerificationStore } from '@/stores/verificationStore.js';

export default function PreviewScreen() {
  const router = useRouter();
  const videoUri = useVerificationStore((s) => s.videoUri);
  const media = useVerificationStore((s) => s.media);
  const clearVideo = useVerificationStore((s) => s.clearVideo);
  const reset = useVerificationStore((s) => s.reset);
  const detail = useGroupStore((s) => s.detail);
  const [submitting, setSubmitting] = useState(false);
  const player = useVideoPlayer(videoUri ?? null, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  useEffect(() => {
    if (!videoUri || !media) router.replace('/verify/camera');
  }, [media, router, videoUri]);

  const retake = () => {
    if (submitting) return;
    reset();
    router.replace('/verify/camera');
  };

  const submit = () => {
    if (submitting) return;
    setSubmitting(true);
    clearVideo();
    router.replace('/verify/loading');
  };

  if (!videoUri || !media) return <View className="flex-1 bg-bg" />;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="relative h-10 flex-row items-center justify-center px-5">
        <Pressable onPress={() => router.back()} disabled={submitting} className="absolute left-5 h-10 w-10 items-center justify-center rounded-xl bg-ink">
          <Text className="text-lg text-white">‹</Text>
        </Pressable>
        <Text className="text-[17px] font-bold text-ink">오늘의 인증</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-4 pt-1">
        <View className="mb-3 items-center rounded-card bg-surface p-3 shadow-sm">
          <Text className="text-[18px] font-bold text-ink">{detail?.group?.name ?? '오늘의 루틴'}</Text>
        </View>

        <View className="mb-3 h-56 w-full overflow-hidden rounded-card bg-black">
          <VideoView player={player} style={{ flex: 1 }} contentFit="cover" nativeControls={false} />
        </View>
        <Text className="mb-3 text-center text-[12px] text-muted">무음으로 재생됩니다.</Text>

        <View className="mb-3 rounded-card border border-line bg-primary-tint p-4">
          <Text className="mb-2 text-[15px] font-bold text-ink">인증 가이드</Text>
          <View className="gap-1.5 pl-1">
            <Text className="text-[13px] text-muted">• 오늘 촬영한 3초 영상을 확인해주세요.</Text>
            <Text className="text-[13px] text-muted">• 인증에는 영상에서 만든 사진 한 장만 제출됩니다.</Text>
            <Text className="text-[13px] text-muted">• 얼굴은 가려도 괜찮습니다.</Text>
          </View>
        </View>

        <View className="gap-2.5">
          <Pressable onPress={submit} disabled={submitting} className="h-[48px] items-center justify-center rounded-pill bg-ink" style={{ opacity: submitting ? 0.7 : 1 }}>
            <Text className="text-[15px] font-bold text-white">{submitting ? '인증을 준비하고 있어요' : '인증하기'}</Text>
          </Pressable>
          <Pressable onPress={retake} disabled={submitting} className="h-[48px] items-center justify-center rounded-pill bg-disabled" style={{ opacity: submitting ? 0.7 : 1 }}>
            <Text className="text-[15px] font-bold text-white">다시 촬영하기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
