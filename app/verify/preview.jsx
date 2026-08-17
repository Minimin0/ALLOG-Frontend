import { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useGroupStore } from '@/stores/groupStore';
import { useVerificationStore } from '@/stores/verificationStore.js';

// 촬영 결과 확인. 사진 한 장을 그대로 보여준다(동영상 아님).
export default function PreviewScreen() {
  const router = useRouter();
  const media = useVerificationStore((s) => s.media);
  const reset = useVerificationStore((s) => s.reset);
  const detail = useGroupStore((s) => s.detail);

  useEffect(() => {
    if (!media) router.replace('/verify/camera');
  }, [media, router]);

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

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-6 pt-2">
        <View className="mb-4 items-center rounded-card bg-surface p-5 shadow-sm">
          <Text className="text-[22px] font-bold text-ink">{detail?.group?.name ?? '오늘의 루틴'}</Text>
        </View>

        {/* 촬영 사진 (3:4) */}
        <View className="mb-4 aspect-[3/4] overflow-hidden rounded-card bg-black">
          <Image source={{ uri: media.uri }} style={{ flex: 1 }} resizeMode="cover" />
        </View>

        <View className="mb-4 rounded-card border border-line bg-primary-tint p-5">
          <Text className="mb-3 text-[17px] font-bold text-ink">인증 가이드</Text>
          <View className="gap-2 pl-1">
            <Text className="text-[15px] text-muted">• 오늘 촬영한 사진만 인증 가능합니다.</Text>
            <Text className="text-[15px] text-muted">• 얼굴은 가려도 괜찮습니다.</Text>
            <Text className="text-[15px] text-muted">• 위치 정보는 서버에서 자동으로 지워집니다.</Text>
          </View>
        </View>

        <View className="gap-3">
          <Pressable onPress={() => router.replace('/verify/loading')} className="h-[52px] items-center justify-center rounded-pill bg-ink">
            <Text className="text-[15px] font-bold text-white">인증하기</Text>
          </Pressable>
          <Pressable onPress={retake} className="h-[52px] items-center justify-center rounded-pill bg-disabled">
            <Text className="text-[15px] font-bold text-white">다시 촬영하기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
