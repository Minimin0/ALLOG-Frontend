import { useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { AuthStatus, authBootstrapErrorMessage, useAuthStore } from '@/stores/authStore';

// 시작 화면 (웹 src/pages/auth/StartPage.jsx의 RN 포팅). 앱 진입점 "/".
// 웹→RN: div→View, p/h1→Text, button→Pressable, useNavigate→useRouter,
//        CSS gradient→<LinearGradient>, 고정 폰 프레임(w-[393px])은 제거(화면=폰).
export default function StartScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const hasSession = useAuthStore((s) => s.hasSession);
  const errorCode = useAuthStore((s) => s.errorCode);

  // SecureStore 세션이 남아 있으면 프로필 상태에 따라 바로 이동한다.
  useEffect(() => {
    if (status === AuthStatus.READY) router.replace('/home');
    else if (status === AuthStatus.ONBOARDING) router.replace('/onboarding/basic-info');
  }, [status, router]);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFFFFF', '#F6F3EC']}
      locations={[0, 0.8125, 1]}
      style={{ flex: 1 }}
    >
      <View className="flex-1 px-12">
        <View className="flex-1 items-center pt-32">
          <Image
            source={require('../mobile/assets/images/Logo.png')}
            className="h-[76px] w-[76px]"
            resizeMode="contain"
          />

          <Text className="mt-2 text-[15px] font-bold text-ink">Anti Lazing Log</Text>

          <Text className="mt-3 text-center text-[28px] font-bold leading-[34px] text-ink">
            건강한 습관을{'\n'}함께 만들어요.
          </Text>

          <Text className="mt-[18px] text-center text-[13px] font-medium leading-5 text-ink">
            AI 코치와 함께하는 루틴 챌린지.{'\n'}크루와 함께라면 더 오래 지속할 수 있어요.
          </Text>
        </View>

        <View className="pb-10">
          {(status === AuthStatus.ERROR_RETRYABLE && hasSession)
            || (status === AuthStatus.SIGNED_OUT && errorCode === 'UNAUTHORIZED') ? (
            <Text className="mb-3 text-center text-[12px] font-semibold text-danger">
              {authBootstrapErrorMessage(errorCode)}
            </Text>
          ) : null}
          <Pressable
            onPress={() => status === AuthStatus.ERROR_RETRYABLE && hasSession
              ? useAuthStore.getState().bootstrap()
              : router.push('/auth/login')}
            className="h-[50px] items-center justify-center rounded-[20px] bg-primary active:opacity-90"
          >
            <Text className="text-[18px] font-bold text-white">
              {status === AuthStatus.ERROR_RETRYABLE && hasSession ? '다시 연결하기' : '시작하기'}
            </Text>
          </Pressable>

          <View className="mt-3 flex-row items-center justify-center">
            <Text className="text-[13px] font-medium text-ink">이미 계정이 있으신가요? </Text>
            <Pressable onPress={() => router.push('/auth/login')} hitSlop={8}>
              <Text className="text-[15px] font-bold text-ink underline">로그인</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
