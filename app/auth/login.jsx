import { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { authErrorMessage } from '@/services/authApi';
import { AuthStatus, authBootstrapErrorMessage, useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';

// 로그인. Backend local ID/password 인증 → ALLOG access token 발급.
const socials = [
  { key: 'naver', label: 'N', bg: '#03C75A' },
  { key: 'apple', label: '', bg: '#000000' },
  { key: 'google', label: 'G', bg: '#ffffff', border: true },
  { key: 'kakao', label: 'K', bg: '#FEE500' },
];

export default function LoginScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const hasSession = useAuthStore((s) => s.hasSession);
  const errorCode = useAuthStore((s) => s.errorCode);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const normalizedLoginId = loginId.trim().toLowerCase();

  // 로그인 성공 후 갈 곳은 GET /users/me 한 번으로 정해진다 (authStore.bootstrap).
  //   READY → 메인 / ONBOARDING(404) → 온보딩. 404는 에러가 아니다.
  useEffect(() => {
    if (status === AuthStatus.READY) {
      setBusy(false);
      router.replace('/home');
    } else if (status === AuthStatus.ONBOARDING) {
      setBusy(false);
      router.replace('/onboarding/basic-info');
    } else if (status === AuthStatus.ERROR_RETRYABLE) {
      setBusy(false);
      setError(authBootstrapErrorMessage(errorCode));
    }
  }, [status, errorCode, router]);

  const submit = async () => {
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      const response = status === AuthStatus.ERROR_RETRYABLE && hasSession
        ? await useAuthStore.getState().bootstrap()
        : await useAuthStore.getState().signIn(normalizedLoginId, password);
      if (!response.ok && response.errorCode !== 'NOT_FOUND') setError(
        useAuthStore.getState().status === AuthStatus.AUTH_ERROR
          ? authErrorMessage(response)
          : authBootstrapErrorMessage(response.errorCode),
      );
    } catch {
      setError('서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  const waiting = busy || status === AuthStatus.LOADING;
  const canRetryBootstrap = status === AuthStatus.ERROR_RETRYABLE && hasSession;
  const validLoginId = /^[a-z0-9_]{4,32}$/.test(normalizedLoginId);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="flex-grow px-12 pt-16 pb-8">
        <Text className="mb-10 text-center text-[40px] font-bold text-ink">LOGIN</Text>

        <TextInput
          value={loginId}
          onChangeText={(value) => setLoginId(value.toLowerCase())}
          placeholder="아이디"
          placeholderTextColor={colors.black}
          autoCapitalize="none"
          autoCorrect={false}
          className="mb-4 h-[50px] rounded-[30px] border border-line bg-white px-5 text-[15px] text-ink"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          placeholderTextColor={colors.black}
          secureTextEntry
          onSubmitEditing={submit}
          className="mb-2 h-[50px] rounded-[30px] border border-line bg-white px-5 text-[15px] text-ink"
        />

        {error ? <Text className="mb-2 text-center text-[12px] font-semibold text-danger">{error}</Text> : null}

        <Pressable
          onPress={submit}
          disabled={waiting || (!canRetryBootstrap && (!validLoginId || password.length < 8))}
          className={`mt-3 h-[50px] items-center justify-center rounded-[20px] bg-primary ${waiting || (!canRetryBootstrap && (!validLoginId || password.length < 8)) ? 'opacity-50' : ''}`}
        >
          {waiting ? <ActivityIndicator color={colors.white} /> : <Text className="text-[18px] font-bold text-white">{canRetryBootstrap ? '다시 연결하기' : '로그인'}</Text>}
        </Pressable>

        <View className="mt-5 flex-row justify-center">
          <Text className="text-[13px] text-ink">계정이 없다면? </Text>
          <Pressable onPress={() => router.push('/auth/signup-account')}>
            <Text className="text-[13px] font-semibold text-ink underline">회원 가입하기</Text>
          </Pressable>
        </View>

        <View className="my-6 h-px bg-gray-border" />
        <Text className="mb-4 text-center text-[15px] font-semibold text-ink">간편 로그인</Text>

        <View className="flex-row justify-center gap-5">
          {socials.map((s) => (
            <Pressable
              key={s.key}
              // 소셜 로그인은 각 provider의 OAuth client 설정이 필요해 아직 연결되지 않았다.
              // 인증을 우회해 온보딩으로 보내는 대신 준비 중임을 알린다.
              onPress={() => setError('소셜 로그인은 아직 준비 중이에요. 아이디로 로그인해 주세요.')}
              className="h-[42px] w-[42px] items-center justify-center rounded-full opacity-40"
              style={{ backgroundColor: s.bg, borderWidth: s.border ? 1 : 0, borderColor: colors.line }}
            >
              <Text className="text-[16px] font-bold" style={{ color: s.bg === '#ffffff' || s.bg === '#FEE500' ? '#000' : '#fff' }}>{s.label || ''}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
