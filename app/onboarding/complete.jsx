import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Icon from '@/components/common/Icon';
import { ApiError } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useUserStore } from '@/stores/userStore';
import { colors } from '@/theme';

// 온보딩 완료. 4단계에서 모은 값을 POST /api/v1/users 한 번으로 보낸다.
// 초기 하트는 백엔드가 지급하고, 프론트는 stats의 실제 잔액만 표시한다.
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

      // 명시적인 기계 코드가 있는 재진입만 완료로 취급한다.
      const alreadyDone = response.data?.error?.code === 'PROFILE_ALREADY_EXISTS';

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
        <ActivityIndicator size="large" color={colors.spinner} />
        <Text className="text-[15px] font-semibold text-subtle">프로필을 저장하고 있어요…</Text>
      </SafeAreaView>
    );
  }

  if (state === 'error') {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center gap-5 bg-bg px-8">
        <Text className="text-center text-[17px] font-bold text-ink">프로필 저장에 실패했어요</Text>
        <Text className="text-center text-[13px] font-medium text-muted">{message}</Text>
        <Pressable onPress={() => router.replace('/onboarding/basic-info')} className="w-full items-center justify-center rounded-[27.5px] bg-black py-4">
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
          <Text className="font-bold text-heart">하트</Text>는 <Text className="font-bold text-ink">그룹 참가</Text>에 사용돼요.
        </Text>

        <View className="mt-6 w-full gap-4 rounded-[23px] border border-line bg-surface p-5">
          <Text className="text-center text-[13px] font-semibold text-subtle">
            그룹에 참가할 때 <Text className="font-bold text-heart">하트 1개</Text>를 사용해요.
          </Text>
          <View className="h-px w-full bg-line" />
          <Text className="text-center text-[13px] font-semibold text-subtle" style={{ lineHeight: 20 }}>
            시작 전에 참가를 취소하거나 그룹이 취소되면{ '\n' }환급은 서버에서 자동 처리돼요.
          </Text>
        </View>
      </View>

      <View className="pb-7">
        <Pressable onPress={() => router.replace('/home')} className="w-full items-center justify-center rounded-[27.5px] bg-black py-[18px]">
          <Text className="text-[15px] font-bold text-white">홈으로 가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
