import { useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import DesignScreen from '../mobile/src/components/DesignScreen';
import { AuthStatus, useAuthStore } from '@/stores/authStore';

// 시작 화면. 앱 진입점 "/".
// 라우팅/세션 로직은 이 저장소(백엔드 연동본)를 유지하고,
// 화면 자체는 팀원 최신 디자인(mobile/src/screens/auth/StartScreen.js)을 그대로 이식했다.
export default function StartScreen() {
  const router = useRouter();
  const status = useAuthStore((s) => s.status);

  // Firebase 세션이 AsyncStorage에 남아 있으면 다시 로그인시키지 않는다.
  useEffect(() => {
    if (status === AuthStatus.READY) router.replace('/home');
    else if (status === AuthStatus.ONBOARDING) router.replace('/onboarding/basic-info');
  }, [status, router]);

  const goLogin = () => router.push('/auth/login');

  return (
    <DesignScreen backgroundColor="#fff">
      <View style={s.body}>
        <View style={s.logo}>
          <Image
            source={require('../assets/images/Logo.png')}
            style={s.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={s.tagline}>Anti Lazing Log</Text>
        <Text style={s.title}>건강한 습관을{`\n`}함께 만들어요.</Text>
        <Text style={s.copy}>
          AI 코치와 함께하는 루틴 챌린지.{`\n`}크루와 함께라면 더 오래 지속할 수 있어요.
        </Text>
      </View>
      <View style={s.actions}>
        <Pressable style={s.primary} onPress={goLogin}>
          <Text style={s.primaryText}>시작하기</Text>
        </Pressable>
        <Text style={s.loginCopy}>
          이미 계정이 있으신가요?{' '}
          <Text style={s.loginLink} onPress={goLogin}>
            로그인
          </Text>
        </Text>
      </View>
    </DesignScreen>
  );
}

const s = StyleSheet.create({
  body: { alignItems: 'center', paddingTop: 47 },
  logo: { marginTop: 120, width: 76, height: 76 },
  logoImage: { width: 76, height: 76 },
  tagline: {
    marginTop: 1,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 35,
    letterSpacing: -0.6,
  },
  title: {
    marginTop: 12,
    width: 282,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 29.5,
    letterSpacing: 1.4,
  },
  copy: {
    marginTop: 18,
    width: 274,
    textAlign: 'center',
    fontSize: 12.643,
    fontWeight: '500',
  },
  actions: { position: 'absolute', top: 588, left: 48, width: 296 },
  primary: {
    height: 50,
    borderRadius: 20,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  loginCopy: {
    height: 35,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 35,
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
