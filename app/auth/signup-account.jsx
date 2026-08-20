import { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { authErrorMessage } from '@/services/authApi';
import { AuthStatus, authBootstrapErrorMessage, useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';

// 계정 만들기. Backend local ID/password 계정을 생성하고 access token을 받는다.
export default function SignUpAccountScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const hasSession = useAuthStore((s) => s.hasSession);
  const errorCode = useAuthStore((s) => s.errorCode);
  const [loginId, setLoginId] = useState('');
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
    } else if (status === AuthStatus.ERROR_RETRYABLE) {
      setBusy(false);
      setError(authBootstrapErrorMessage(errorCode));
    }
  }, [status, errorCode, router]);

  const submit = async () => {
    if (busy || !match) return;
    setError('');
    setBusy(true);
    try {
      const response = status === AuthStatus.ERROR_RETRYABLE && hasSession
        ? await useAuthStore.getState().bootstrap()
        : await useAuthStore.getState().signUp(loginId, password);
      if (!response.ok && response.errorCode !== 'NOT_FOUND') setError(
        status === AuthStatus.ERROR_RETRYABLE && hasSession
          ? authBootstrapErrorMessage(response.errorCode)
          : authErrorMessage(response),
      );
    } catch {
      setError('서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setBusy(false);
    }
  };

  const waiting = busy || status === AuthStatus.LOADING;
  const validLoginId = /^[a-z0-9_]{4,32}$/.test(loginId);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-1 px-6 pt-16">
        <Pressable onPress={() => router.back()} className="mb-4 h-8 w-8 items-center justify-center">
          <Text className="text-2xl text-ink">‹</Text>
        </Pressable>

        <Text className="text-[25px] font-black text-ink" style={{ lineHeight: 35 }}>아이디와 비밀번호를{'\n'}입력해 주세요.</Text>

        <Text className="mt-8 text-[15px] font-bold text-subtle">아이디</Text>
        <TextInput
          value={loginId}
          onChangeText={(value) => setLoginId(value.toLowerCase())}
          placeholder="영문 소문자, 숫자, _ (4~32자)"
          placeholderTextColor={colors.disabled}
          autoCapitalize="none"
          autoCorrect={false}
          className="mt-2 h-11 rounded-[15px] border border-line bg-surface px-4 text-[16px] text-ink"
        />

        <Text className="mt-6 text-[15px] font-bold text-subtle">비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="비밀번호 (8자리 이상)"
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
          disabled={waiting || !match || !validLoginId || password.length < 8}
          className={`mb-4 h-[50px] items-center justify-center rounded-[20px] bg-ink ${waiting || !match || !validLoginId || password.length < 8 ? 'opacity-50' : ''}`}
        >
          {waiting ? <ActivityIndicator color={colors.white} /> : <Text className="text-[18px] font-bold text-[#f2f2f6]">완료</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
