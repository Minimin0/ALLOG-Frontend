import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ApiError } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useUserStore } from '@/stores/userStore';

// 온보딩 완료. 4단계에서 모은 값을 POST /api/v1/users 한 번으로 보낸다.
// 초기 하트는 백엔드가 지급하고, 프론트는 stats의 실제 잔액만 표시한다.
// 완료 화면 디자인은 팀원 최신본(mobile/src/screens/onboarding/CompleteScreen.js) 이식.
// 단, 도너가 "하트 3개"로 박아둔 값은 쓰지 않고 실제 stats.hearts를 그대로 보여준다.

// 하트 하나: 통통 튀며 나타난 뒤 계속 살짝 위아래로 움직임.
function AnimatedHeart({ delay }) {
  const scale = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 340,
      delay,
      easing: Easing.out(Easing.back(1.8)),
      useNativeDriver: true,
    }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(y, {
          toValue: -6,
          duration: 520,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(y, {
          toValue: 0,
          duration: 520,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [delay, scale, y]);
  return <Animated.Text style={[s.heart, { transform: [{ scale }, { translateY: y }] }]}>♥</Animated.Text>;
}

export default function OnboardingCompleteScreen() {
  const router = useRouter();
  const [state, setState] = useState('submitting'); // submitting | done | error
  const [message, setMessage] = useState('');
  const stats = useUserStore((s) => s.stats);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const body = useOnboardingStore.getState().toCreateProfileRequest();
      const response = await useUserStore.getState().createProfile(body);
      if (cancelled) return;

      // 명시적인 기계 코드가 있는 재진입만 완료로 취급한다.
      const alreadyDone = response.data?.error?.code === 'PROFILE_ALREADY_EXISTS';

      if (response.ok || alreadyDone) {
        useOnboardingStore.getState().reset();
        useAuthStore.getState().markReady();
        await useUserStore.getState().loadStats();
        if (!cancelled) setState('done');
        return;
      }

      setMessage(
        response.errorCode === ApiError.NETWORK
          ? '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.'
          : response.data?.error?.message || '프로필을 저장하지 못했어요. 입력값을 다시 확인해주세요.',
      );
      setState('error');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === 'submitting') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={s.center}>
        <ActivityIndicator size="large" color="#14453a" />
        <Text style={s.centerText}>프로필을 저장하고 있어요…</Text>
      </SafeAreaView>
    );
  }

  if (state === 'error') {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={s.center}>
        <Text style={s.errorTitle}>프로필 저장에 실패했어요</Text>
        <Text style={s.errorMessage}>{message}</Text>
        <Pressable onPress={() => router.replace('/onboarding/basic-info')} style={s.retry}>
          <Text style={s.buttonText}>다시 입력하기</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const hearts = stats?.hearts ?? 0;

  return (
    <View style={s.screen}>
      <View style={s.body}>
        <View style={s.check}>
          <Text style={s.checkText}>✓</Text>
        </View>
        <Text style={s.title}>환영합니다!{`\n`}하트 {hearts}개를 받았어요.</Text>
        <View style={s.heartsRow}>
          {Array.from({ length: hearts }).map((_, i) => (
            <AnimatedHeart key={i} delay={i * 120} />
          ))}
        </View>
        <Text style={s.copy}>
          <Text style={s.red}>하트</Text>는 <Text style={s.bold}>그룹 참가</Text>에 사용돼요.
        </Text>
        <View style={s.card}>
          <Text style={s.cardHead}>
            그룹에 참가할 때 <Text style={s.red}>하트 1개</Text>를 사용해요
          </Text>
          <View style={s.line} />
          <Text style={s.refundText}>
            시작 전에 참가를 취소하거나 그룹이 취소되면{`\n`}환급은 서버에서 자동 처리돼요.
          </Text>
        </View>
      </View>
      <Pressable style={s.button} onPress={() => router.replace('/home')}>
        <Text style={s.buttonText}>홈으로 가기</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f6f3', paddingHorizontal: 20 },
  center: {
    flex: 1,
    backgroundColor: '#f7f6f3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    gap: 16,
  },
  centerText: { fontSize: 15, fontWeight: '600', color: '#4a4a4a' },
  errorTitle: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  errorMessage: { fontSize: 13, fontWeight: '500', color: '#6b7268', textAlign: 'center' },
  retry: {
    width: '100%',
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 36 },
  check: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontSize: 28, color: '#fff' },
  title: { marginTop: 24, textAlign: 'center', fontSize: 25, lineHeight: 32, fontWeight: '700' },
  heartsRow: { marginTop: 24, flexDirection: 'row', gap: 12, height: 40, alignItems: 'center' },
  heart: { fontSize: 34, color: '#d9573b' },
  copy: { marginTop: 24, fontSize: 18, fontWeight: '600', color: '#4a4a4a' },
  red: { color: '#d9573b', fontWeight: '700' },
  bold: { color: '#000', fontWeight: '700' },
  card: {
    marginTop: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e7e3d8',
    borderRadius: 23,
    backgroundColor: '#fefefe',
    padding: 22,
    gap: 16,
  },
  cardHead: { textAlign: 'center', fontSize: 15, lineHeight: 21, fontWeight: '700', color: '#000' },
  refundText: { textAlign: 'center', fontSize: 13, fontWeight: '600', lineHeight: 20, color: '#4a4a4a' },
  line: { height: 1, backgroundColor: '#e7e3d8' },
  button: {
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 52,
  },
  buttonText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
