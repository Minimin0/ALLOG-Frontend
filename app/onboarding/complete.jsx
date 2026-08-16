import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Icon from '@/components/common/Icon';
import { ApiError } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useUserStore } from '@/stores/userStore';

// 온보딩 완료. 4단계에서 모은 값을 POST /api/v1/users 한 번으로 보낸다.
// 하트 3개는 백엔드가 같은 트랜잭션에서 지급한다 — 프론트가 지급하지 않고, 결과만 읽어서 보여준다.
export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const [state, setState] = useState('submitting'); // submitting | done | error
  const [message, setMessage] = useState('');
  const stats = useUserStore((s) => s.stats);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const body = useOnboardingStore.getState().toCreateProfileRequest();
      const response = await useUserStore.getState().createProfile(body);
      if (cancelled) return;

      // 이미 프로필이 있으면(재진입) 실패가 아니라 완료로 본다.
      const alreadyDone =
        response.errorCode === ApiError.CONFLICT &&
        (response.data?.error?.code === 'PROFILE_ALREADY_EXISTS' || response.status === 409);

      if (response.ok || alreadyDone) {
        useOnboardingStore.getState().reset();
        useAuthStore.getState().markReady();
        await useUserStore.getState().loadStats();
        if (!cancelled) setState('done');
        return;
      }

      setMessage(
        response.errorCode === ApiError.NETWORK
          ? '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.'
          : response.data?.error?.message || '프로필을 저장하지 못했어요. 입력값을 다시 확인해주세요.',
      );
      setState('error');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'submitting') {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center gap-4 bg-bg px-5">
        <ActivityIndicator size="large" color="#4b7f63" />
        <Text className="text-[15px] font-semibold text-subtle">프로필을 저장하고 있어요…</Text>
      </SafeAreaView>
    );
  }

  if (state === 'error') {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center gap-5 bg-bg px-8">
        <Text className="text-center text-[17px] font-bold text-ink">프로필 저장에 실패했어요</Text>
        <Text className="text-center text-[13px] font-medium text-muted">{message}</Text>
        <Pressable onPress={() => router.replace('/onboarding/basic-info')} className="w-full items-center justify-center rounded-[27.5px] bg-primary py-4">
          <Text className="text-[15px] font-bold text-white">다시 입력하기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const hearts = stats?.hearts ?? 0;

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg px-5">
      <View className="flex-1 items-center pt-16">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Text className="text-[28px] text-white">✓</Text>
        </View>

        <Text className="mt-6 text-center text-[25px] font-bold text-ink" style={{ lineHeight: 32 }}>환영합니다!{'\n'}하트 {hearts}개를 받았어요.</Text>

        <View className="mt-6 flex-row gap-3">
          {Array.from({ length: hearts }).map((_, i) => (
            <Icon key={i} name="heart" size={34} />
          ))}
        </View>

        <Text className="mt-6 text-center text-[18px] font-semibold text-subtle">
          <Text className="font-bold text-[#d9573b]">하트</Text>는 <Text className="font-bold text-ink">그룹 참가</Text>에만 사용돼요.
        </Text>

        <View className="mt-6 w-full gap-4 rounded-[23px] border border-line bg-surface p-5">
          <Text className="text-center text-[13px] font-semibold text-subtle">
            그룹에 참가할 때 <Text className="font-bold text-[#d9573b]">하트 1개</Text>를 사용해요.
          </Text>
          <View className="h-px w-full bg-line" />
          <View className="flex-row items-center justify-between gap-2">
            <Text className="flex-1 text-center text-[13px] font-semibold text-subtle" style={{ lineHeight: 20 }}>그룹 공동 성공률 80% 이상{'\n'}+{'\n'}개인 달성율 70% 이상</Text>
            <Text className="text-[16px] text-subtle">→</Text>
            <Text className="flex-1 text-center text-[13px] font-semibold text-[#d9573b]" style={{ lineHeight: 20 }}>하트 1개를{'\n'}다시 받아요.</Text>
          </View>
        </View>
      </View>

      <View className="pb-7">
        <Pressable onPress={() => router.replace('/home')} className="w-full items-center justify-center rounded-[27.5px] bg-primary py-[18px]">
          <Text className="text-[15px] font-bold text-white">홈으로 가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
