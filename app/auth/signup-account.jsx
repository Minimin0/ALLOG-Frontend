import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import DesignScreen from '../../mobile/src/components/DesignScreen';
import { authErrorMessage, signUp } from '@/services/authApi';
import { AuthStatus, useAuthStore } from '@/stores/authStore';

// 계정 만들기. Firebase 이메일/비밀번호 계정을 실제로 생성한다.
// 백엔드에는 회원가입 API가 없다 — 첫 인증 요청에서 내부 사용자가 만들어지고,
// 프로필은 온보딩 마지막 단계의 POST /api/v1/users가 만든다.
// 화면은 팀원 최신 디자인(mobile/src/screens/auth/SignUpAccountScreen.js) 이식.
// 다만 Firebase 계정 식별자가 이메일이라 첫 필드는 아이디가 아니라 이메일을 받는다.
export default function SignUpAccountScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const match = password === confirm;
  const emailError = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email.trim());
  const pwError = password.length > 0 && (password.length < 10 || password.length > 12);
  const mismatch = confirm.length > 0 && !match;
  const showCheck = confirm.length > 0 && match;
  const valid = email.trim() && password.trim() && confirm.trim() && match && !emailError && !pwError;

  // 계정이 생기면 프로필이 없으므로 GET /users/me는 404 → 온보딩으로 간다.
  useEffect(() => {
    if (status === AuthStatus.ONBOARDING) router.replace('/onboarding/basic-info');
    else if (status === AuthStatus.READY) router.replace('/home');
  }, [status, router]);

  const submit = async () => {
    if (busy || !valid) return;
    setError('');
    setBusy(true);
    try {
      await signUp(email, password);
    } catch (e) {
      setError(authErrorMessage(e));
      setBusy(false);
    }
  };

  const waiting = busy || status === AuthStatus.LOADING;

  return (
    <DesignScreen>
      <View style={s.body}>
        <Text style={s.title}>이메일과 비밀번호를{`\n`}입력해 주세요.</Text>

        <Text style={s.label}>이메일</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="allog@example.com"
          placeholderTextColor="#bababa"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={[s.input, emailError && s.inputError]}
        />
        {emailError ? <Text style={s.error}>이메일 형식으로 입력해주세요</Text> : null}

        <Text style={[s.label, { marginTop: 18 }]}>비밀번호</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="비밀번호 (10~12자리 이내의 영어 대소문자, 숫자 포함)"
          placeholderTextColor="#bababa"
          style={[s.input, (pwError || mismatch) && s.inputError]}
        />
        {pwError ? <Text style={s.error}>비밀번호는 10~12자로 입력해주세요</Text> : null}

        <View style={{ marginTop: 10 }}>
          <View style={[s.confirmRow, mismatch && s.inputError]}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              placeholder="비밀번호 확인"
              placeholderTextColor="#bababa"
              style={s.confirmInput}
            />
            {showCheck ? <Text style={s.check}>✓</Text> : null}
          </View>
          {mismatch ? <Text style={s.error}>비밀번호가 일치하지 않아요.</Text> : null}
        </View>

        {error ? <Text style={[s.error, { marginTop: 12 }]}>{error}</Text> : null}
      </View>

      <Pressable
        disabled={waiting || !valid}
        onPress={submit}
        style={[s.next, (waiting || !valid) && { backgroundColor: '#bababa' }]}
      >
        {waiting ? <ActivityIndicator color="#fff" /> : <Text style={s.nextText}>완료</Text>}
      </Pressable>
    </DesignScreen>
  );
}

const s = StyleSheet.create({
  body: { position: 'absolute', left: 26, right: 24, top: 118 },
  title: { fontSize: 25, lineHeight: 32.5, fontWeight: '700' },
  label: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 35,
    color: '#4a4a4a',
    marginTop: 24,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    borderRadius: 15,
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    paddingVertical: 0,
    textAlignVertical: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#4a4a4a',
  },
  inputError: { borderColor: '#d9573b' },
  confirmRow: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    borderRadius: 15,
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmInput: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    textAlignVertical: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#4a4a4a',
  },
  check: { color: '#14453a', fontSize: 18, fontWeight: '700' },
  error: { marginTop: 6, fontSize: 11, fontWeight: '600', color: '#d9573b' },
  next: {
    position: 'absolute',
    left: 31,
    bottom: 52,
    width: 338,
    height: 50,
    borderRadius: 20,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { color: '#f2f2f6', fontSize: 18, fontWeight: '700' },
});
