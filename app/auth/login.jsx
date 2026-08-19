import { useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import DesignScreen from '../../mobile/src/components/DesignScreen';
import Naver from '../../assets/icons/Naver.svg';
import Apple from '../../assets/icons/Apple.svg';
import Google from '../../assets/icons/Google.svg';
import Kakao from '../../assets/icons/Kakao.svg';

import { authErrorMessage, signIn } from '@/services/authApi';
import { isFirebaseConfigured } from '@/services/firebase';
import { AuthStatus, useAuthStore } from '@/stores/authStore';

// 로그인. Firebase 이메일/비밀번호 인증 → 백엔드가 검증하는 ID Token 발급.
// signInWithPopup 같은 웹 전용 API는 RN에서 동작하지 않으므로 쓰지 않는다.
// 화면은 팀원 최신 디자인(mobile/src/screens/auth/LoginScreen.js)을 이식했고,
// 인증/라우팅 로직은 이 저장소(백엔드 연동본)를 그대로 유지한다.
const socials = [
  ['네이버 로그인', Naver],
  ['Apple 로그인', Apple],
  ['Google 로그인', Google],
  ['카카오 로그인', Kakao],
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
    if (busy || !email || !password) return;
    Keyboard.dismiss();
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
  const disabled = waiting || !email || !password;

  return (
    <DesignScreen>
      <Text style={s.title}>LOGIN</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={[s.input, { top: 201 }]}
        // Firebase 인증이 이메일/비밀번호라서 라벨은 "이메일"을 유지한다 (회원가입도 이메일).
        placeholder="이메일"
        placeholderTextColor="#bababa"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        returnKeyType="next"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        style={[s.input, { top: 267, height: 49 }]}
        placeholder="비밀번호"
        placeholderTextColor="#bababa"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={submit}
      />
      <Pressable style={[s.login, disabled && s.loginDisabled]} onPress={submit} disabled={disabled}>
        {waiting ? <ActivityIndicator color="#fff" /> : <Text style={s.loginText}>로그인</Text>}
      </Pressable>
      <Pressable style={[s.find, { left: 128 }]}>
        <Text style={s.findText}>아이디 찾기</Text>
      </Pressable>
      <Pressable style={[s.find, { left: 211 }]}>
        <Text style={s.findText}>비밀번호 찾기</Text>
      </Pressable>
      <View style={s.signup}>
        <Text style={s.signupText}>계정이 없다면?</Text>
        <Text style={s.signupLink} onPress={() => router.push('/auth/signup-phone')}>
          회원가입하기
        </Text>
      </View>
      <View style={s.line} />
      <Text style={s.easy}>간편 로그인</Text>
      <View style={s.socials}>
        {socials.map(([label, Icon]) => (
          <Pressable
            key={label}
            accessibilityLabel={label}
            style={s.social}
            // 소셜 로그인은 각 provider의 OAuth client 설정이 필요해 아직 연결되지 않았다.
            // 인증을 우회해 온보딩으로 보내는 대신 준비 중임을 알린다.
            onPress={() => setError('소셜 로그인은 아직 준비 중이에요. 이메일로 로그인해주세요.')}
          >
            <Icon width={34} height={34} />
          </Pressable>
        ))}
      </View>
      {error ? <Text style={s.error}>{error}</Text> : null}
      {!isFirebaseConfigured && (
        <Text style={[s.error, { top: 652 }]}>
          Firebase 환경변수가 비어 있어 로그인할 수 없어요. (.env의 EXPO_PUBLIC_FIREBASE_*)
        </Text>
      )}
    </DesignScreen>
  );
}

const s = StyleSheet.create({
  title: {
    position: 'absolute',
    left: 129,
    top: 133,
    width: 128,
    textAlign: 'center',
    fontSize: 40,
    fontWeight: '700',
    lineHeight: 48,
    letterSpacing: -1.6,
  },
  input: {
    position: 'absolute',
    left: 49,
    width: 296,
    height: 50,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    borderRadius: 30,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    fontSize: 15,
    fontWeight: '500',
  },
  login: {
    // 도너 원본은 left:44라 입력창(left:49)보다 5px 밀려 보인다 — 정렬만 맞춤.
    position: 'absolute',
    left: 49,
    top: 346,
    width: 296,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginDisabled: { opacity: 0.5 },
  loginText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  find: { position: 'absolute', top: 401, height: 30 },
  findText: { fontSize: 12.643, fontWeight: '500', lineHeight: 29.5 },
  signup: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 473,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: { fontSize: 13, fontWeight: '500', color: '#6b7268' },
  signupLink: {
    marginLeft: 6,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#14453a',
  },
  line: {
    position: 'absolute',
    left: 48,
    top: 511,
    width: 298,
    height: 1,
    backgroundColor: '#d9d9d9',
  },
  easy: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 529,
    textAlign: 'center',
    fontSize: 15.333,
    fontWeight: '600',
    lineHeight: 26.833,
  },
  socials: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 568,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 19,
  },
  social: { width: 34, height: 34 },
  error: {
    position: 'absolute',
    left: 49,
    top: 612,
    width: 296,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#e75b5b',
  },
});
