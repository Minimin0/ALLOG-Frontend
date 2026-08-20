import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { AuthStatus, authBootstrapErrorMessage, useAuthStore } from '@/stores/authStore';

// 시작 화면 (웹 src/pages/auth/StartPage.jsx의 RN 포팅). 앱 진입점 "/".
// 웹→RN: div→View, p/h1→Text, button→Pressable, useNavigate→useRouter,
//        CSS gradient→<LinearGradient>, 고정 폰 프레임(w-[393px])은 제거(화면=폰).
export default function StartScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const errorCode = useAuthStore((s) => s.errorCode);

  // Firebase 세션이 AsyncStorage에 남아 있으면 다시 로그인시키지 않는다.
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
          {/* TODO: 실제 로고 에셋으로 교체 → <Image source={require('../assets/images/Logo.png')} /> */}
          <View className="h-[76px] w-[76px] items-center justify-center rounded-2xl bg-primary-tint">
            <Text className="text-3xl font-bold text-primary">A</Text>
          </View>

          <Text className="mt-2 text-[15px] font-bold text-ink">Anti Lazing Log</Text>

          <Text className="mt-3 text-center text-[28px] font-bold leading-[34px] text-ink">
            건강한 습관을{'\n'}함께 만들어요.
          </Text>

          <Text className="mt-[18px] text-center text-[13px] font-medium leading-5 text-ink">
            AI 코치와 함께하는 루틴 챌린지.{'\n'}크루와 함께라면 더 오래 지속할 수 있어요.
          </Text>
        </View>

        <View className="pb-10">
          {status === AuthStatus.ERROR && firebaseUser ? (
            <Text className="mb-3 text-center text-[12px] font-semibold text-danger">
              {authBootstrapErrorMessage(errorCode)}
            </Text>
          ) : null}
          <Pressable
            onPress={() => status === AuthStatus.ERROR && firebaseUser
              ? useAuthStore.getState().bootstrap()
              : router.push('/auth/login')}
            className="h-[50px] items-center justify-center rounded-[20px] bg-primary active:opacity-90"
          >
            <Text className="text-[18px] font-bold text-white">
              {status === AuthStatus.ERROR && firebaseUser ? '다시 연결하기' : '시작하기'}
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
