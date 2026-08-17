import { useEffect, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { authErrorMessage, signIn } from '@/services/authApi';
import { isFirebaseConfigured } from '@/services/firebase';
import { AuthStatus, useAuthStore } from '@/stores/authStore';

// 로그인. Firebase 이메일/비밀번호 인증 → 백엔드가 검증하는 ID Token 발급.
// signInWithPopup 같은 웹 전용 API는 RN에서 동작하지 않으므로 쓰지 않는다.
const socials = [
  { key: 'naver', label: 'N', bg: '#03C75A' },
  { key: 'apple', label: '', bg: '#000000' },
  { key: 'google', label: 'G', bg: '#ffffff', border: true },
  { key: 'kakao', label: 'K', bg: '#FEE500' },
];

export default function LoginScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // 로그인 성공 후 갈 곳은 GET /users/me 한 번으로 정해진다 (authStore.bootstrap).
  //   READY → 메인 / ONBOARDING(404) → 온보딩. 404는 에러가 아니다.
  useEffect(() => {
    if (status === AuthStatus.READY) router.replace('/home');
    else if (status === AuthStatus.ONBOARDING) router.replace('/onboarding/basic-info');
  }, [status, router]);

  const submit = async () => {
    if (busy) return;
    setError('');
    setBusy(true);
    try {
      await signIn(email, password);
      // 이후 라우팅은 authStore 구독이 bootstrap을 마치면 위 effect가 처리한다.
    } catch (e) {
      setError(authErrorMessage(e));
      setBusy(false);
    }
  };

  const waiting = busy || status === AuthStatus.LOADING;

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <ScrollView contentContainerClassName="flex-grow px-12 pt-16 pb-8">
        <Text className="mb-10 text-center text-[40px] font-bold text-ink">LOGIN</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="이메일"
          placeholderTextColor="#000000"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          className="mb-4 h-[50px] rounded-[30px] border border-line bg-white px-5 text-[15px] text-ink"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="비밀번호"
          placeholderTextColor="#000000"
          secureTextEntry
          onSubmitEditing={submit}
          className="mb-2 h-[50px] rounded-[30px] border border-line bg-white px-5 text-[15px] text-ink"
        />

        {!isFirebaseConfigured && (
          <Text className="mb-2 text-center text-[12px] font-semibold text-danger">
            Firebase 환경변수가 비어 있어 로그인할 수 없어요. (.env의 EXPO_PUBLIC_FIREBASE_*)
          </Text>
        )}
        {error ? <Text className="mb-2 text-center text-[12px] font-semibold text-danger">{error}</Text> : null}

        <Pressable
          onPress={submit}
          disabled={waiting || !email || !password}
          className={`mt-3 h-[50px] items-center justify-center rounded-[20px] bg-primary ${waiting || !email || !password ? 'opacity-50' : ''}`}
        >
          {waiting ? <ActivityIndicator color="#fff" /> : <Text className="text-[18px] font-bold text-white">로그인</Text>}
        </Pressable>

        <View className="mt-3 flex-row justify-center gap-6">
          <Text className="text-[13px] text-ink">아이디 찾기</Text>
          <Text className="text-[13px] text-ink">비밀번호 찾기</Text>
        </View>

        <View className="mt-5 flex-row justify-center">
          <Text className="text-[13px] text-ink">계정이 없다면? </Text>
          <Pressable onPress={() => router.push('/auth/signup-phone')}>
            <Text className="text-[13px] font-semibold text-ink underline">회원 가입하기</Text>
          </Pressable>
        </View>

        <View className="my-6 h-px bg-[#d9d9d9]" />
        <Text className="mb-4 text-center text-[15px] font-semibold text-ink">간편 로그인</Text>

        <View className="flex-row justify-center gap-5">
          {socials.map((s) => (
            <Pressable
              key={s.key}
              // 소셜 로그인은 각 provider의 OAuth client 설정이 필요해 아직 연결되지 않았다.
              // 인증을 우회해 온보딩으로 보내는 대신 준비 중임을 알린다.
              onPress={() => setError('소셜 로그인은 아직 준비 중이에요. 이메일로 로그인해주세요.')}
              className="h-[42px] w-[42px] items-center justify-center rounded-full opacity-40"
              style={{ backgroundColor: s.bg, borderWidth: s.border ? 1 : 0, borderColor: '#e7e3d8' }}
            >
              <Text className="text-[16px] font-bold" style={{ color: s.bg === '#ffffff' || s.bg === '#FEE500' ? '#000' : '#fff' }}>{s.label || ''}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
