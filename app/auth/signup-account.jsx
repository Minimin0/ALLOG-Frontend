import { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { authErrorMessage, signUp } from '@/services/authApi';
import { AuthStatus, authBootstrapErrorMessage, useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';

// 계정 만들기. Firebase 이메일/비밀번호 계정을 실제로 생성한다.
// 백엔드에는 회원가입 API가 없다 — 첫 인증 요청에서 내부 사용자가 만들어지고,
// 프로필은 온보딩 마지막 단계의 POST /api/v1/users가 만든다.
export default function SignUpAccountScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const errorCode = useAuthStore((s) => s.errorCode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const match = confirm.length > 0 && password === confirm;

  // 계정이 생기면 프로필이 없으므로 GET /users/me는 404 → 온보딩으로 간다.
  useEffect(() => {
    if (status === AuthStatus.ONBOARDING) {
      setBusy(false);
      router.replace('/onboarding/basic-info');
    } else if (status === AuthStatus.READY) {
      setBusy(false);
      router.replace('/home');
    } else if (status === AuthStatus.ERROR) {
      setBusy(false);
      setError(authBootstrapErrorMessage(errorCode));
    }
  }, [status, errorCode, router]);

  const submit = async () => {
    if (busy || !match) return;
    setError('');
    setBusy(true);
    try {
      if (status === AuthStatus.ERROR && firebaseUser) {
        await useAuthStore.getState().bootstrap();
      } else {
        await signUp(email, password);
      }
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const waiting = busy || status === AuthStatus.LOADING;

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-16">
        <Pressable onPress={() => router.back()} className="mb-4 h-8 w-8 items-center justify-center">
          <Text className="text-2xl text-ink">‹</Text>
        </Pressable>

        <Text className="text-[25px] font-black text-ink" style={{ lineHeight: 35 }}>이메일과 비밀번호를{'\n'}입력해 주세요.</Text>

        <Text className="mt-8 text-[15px] font-bold text-subtle">이메일</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="allog@example.com"
          placeholderTextColor={colors.disabled}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          className="mt-2 h-11 rounded-[15px] border border-line bg-surface px-4 text-[16px] text-ink"
        />

        <Text className="mt-6 text-[15px] font-bold text-subtle">비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="비밀번호 (6자리 이상)"
          placeholderTextColor={colors.disabled}
          className="mt-2 h-11 rounded-[15px] border border-line bg-surface px-4 text-[16px] text-ink"
        />

        <View className="mt-3 h-11 flex-row items-center rounded-[15px] border border-line bg-surface px-4">
          <TextInput
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            placeholder="비밀번호 확인"
            placeholderTextColor={colors.disabled}
            className="flex-1 text-[16px] text-ink"
          />
          {match && <Text className="text-primary">✓</Text>}
        </View>

        {error ? <Text className="mt-3 text-[12px] font-semibold text-danger">{error}</Text> : null}

        <View className="flex-1" />

        <Pressable
          onPress={submit}
          disabled={waiting || !match || !email}
          className={`mb-4 h-[50px] items-center justify-center rounded-[20px] bg-ink ${waiting || !match || !email ? 'opacity-50' : ''}`}
        >
          {waiting ? <ActivityIndicator color={colors.white} /> : <Text className="text-[18px] font-bold text-[#f2f2f6]">완료</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
