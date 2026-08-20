import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import DesignScreen from '../mobile/src/components/DesignScreen';
import { AuthStatus, authBootstrapErrorMessage, useAuthStore } from '@/stores/authStore';

export default function StartScreen() {
  const router = useRouter();
  const status = useAuthStore((state) => state.status);
  const hasSession = useAuthStore((state) => state.hasSession);
  const errorCode = useAuthStore((state) => state.errorCode);

  useEffect(() => {
    if (status === AuthStatus.READY) router.replace('/home');
    else if (status === AuthStatus.ONBOARDING) router.replace('/onboarding/basic-info');
  }, [status, router]);

  const retrying = status === AuthStatus.ERROR_RETRYABLE && hasSession;
  const showError = retrying || (status === AuthStatus.SIGNED_OUT && errorCode === 'UNAUTHORIZED');

  return (
    <DesignScreen backgroundColor="#fff">
      <View style={s.body}>
        <Image source={require('../mobile/assets/images/Logo.png')} style={s.logo} resizeMode="contain" />
        <Text style={s.tagline}>Anti Lazing Log</Text>
        <Text style={s.title}>건강한 습관을{`\n`}함께 만들어요.</Text>
        <Text style={s.copy}>AI 코치와 함께하는 루틴 챌린지.{`\n`}크루와 함께라면 더 오래 지속할 수 있어요.</Text>
      </View>
      <View style={s.actions}>
        {showError ? <Text style={s.error}>{authBootstrapErrorMessage(errorCode)}</Text> : null}
        <Pressable style={s.primary} onPress={() => retrying ? useAuthStore.getState().bootstrap() : router.push('/auth/login')}>
          <Text style={s.primaryText}>{retrying ? '다시 연결하기' : '시작하기'}</Text>
        </Pressable>
        <View style={s.loginRow}>
          <Text style={s.loginCopy}>이미 계정이 있으신가요? </Text>
          <Pressable onPress={() => router.push('/auth/login')} hitSlop={8}><Text style={s.loginLink}>로그인</Text></Pressable>
        </View>
      </View>
    </DesignScreen>
  );
}

const s = StyleSheet.create({
  body: { alignItems: 'center', paddingTop: 167 },
  logo: { width: 76, height: 76 },
  tagline: { marginTop: 1, fontSize: 15, fontWeight: '700', lineHeight: 35, letterSpacing: -0.6 },
  title: { marginTop: 12, width: 282, textAlign: 'center', fontSize: 28, fontWeight: '700', lineHeight: 29.5, letterSpacing: 1.4 },
  copy: { marginTop: 18, width: 274, textAlign: 'center', fontSize: 12.643, fontWeight: '500' },
  actions: { position: 'absolute', top: 588, left: 48, width: 296 },
  primary: { height: 50, borderRadius: 20, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  loginRow: { height: 35, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  loginCopy: { fontSize: 13, fontWeight: '500' },
  loginLink: { fontSize: 15, fontWeight: '700', textDecorationLine: 'underline' },
  error: { marginBottom: 8, textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#c0492f' },
});
