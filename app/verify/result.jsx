import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing } from 'react-native-reanimated';

import Mascot from '@/components/common/Mascot';
import { mockRetryGuide, mockVerifyFeedback } from '@/data/mockGroups.js';
import { useVerificationStore } from '@/stores/verificationStore.js';
import { useAppState } from '../../mobile/src/state/AppState';

// 성공 화면 진입 시 마스코트가 한 번 폴짝 뛰는 연출. 착지 후엔 Mascot의 continuous sway로 이어짐.
function HopMascot({ size }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withSequence(
      withTiming(-24, { duration: 240, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 280, easing: Easing.bounce }),
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View style={style}>
      <Mascot size={size} animated />
    </Animated.View>
  );
}

const PRAISES = [
  '오늘도 해냈어요! 🌱', '역시 최고예요! 👏', '꾸준함이 멋져요! ✨', '완벽한 인증이에요! 🎉',
  '이 기세 그대로! 💪', '오늘도 한 걸음 더! 🌿', '몸도 마음도 튼튼! 🌞', '작은 습관이 큰 힘이 돼요 🌳',
  '오늘의 나, 칭찬해요! 👍', '멈추지 않는 게 멋져요 🔥', '루틴 완성, 대단해요! 🏅', '한결같은 당신이 최고 💚',
  '오늘도 새싹이 쑥쑥! 🌱', '해낼 줄 알았어요! ⭐', '내일도 함께해요! 🤝',
];

// 인증 결과 (웹 VerificationResultPage 포팅). 성공 / 재인증 분기.
export default function ResultScreen() {
  const router = useRouter();
  const result = useVerificationStore((s) => s.result) ?? 'success';
  const reset = useVerificationStore((s) => s.reset);
  const isSuccess = result === 'success';
  const [praise] = useState(() => PRAISES[Math.floor(Math.random() * PRAISES.length)]);
  const { setVerifiedToday } = useAppState();

  // 인증 성공 시 홈 화면 "오늘의 루틴" 카드가 완료 상태로 바뀌도록 표시.
  useEffect(() => {
    if (isSuccess) setVerifiedToday(true);
  }, [isSuccess, setVerifiedToday]);

  const goToGroup = () => {
    reset();
    router.replace('/group');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center bg-bg p-6">
      <View className="flex-1 items-center justify-center gap-4">
        {isSuccess ? (
          <>
            {/* 칭찬 말풍선 */}
            <View className="rounded-2xl bg-surface px-4 py-2.5 shadow" style={{ borderWidth: 1, borderColor: '#e7e3d8' }}>
              <Text className="text-[15px] font-semibold text-ink">{praise}</Text>
            </View>

            {/* 마스코트 (등장 시 한 번 폴짝) */}
            <View className="h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-primary-tint">
              <HopMascot size={120} />
            </View>
            <Text className="text-[22px] font-bold text-ink">인증 성공!</Text>

            {/* 패턴 피드백 */}
            <View className="w-full max-w-[280px] flex-row gap-3">
              <View className="flex-1 items-center gap-1.5 rounded-card border border-line bg-primary-tint py-4">
                <Text className="text-[11px] font-semibold text-muted">🔥 연속 성공</Text>
                <Text className="text-[20px] font-bold text-primary">{mockVerifyFeedback.streak}일</Text>
              </View>
              <View className="flex-1 items-center gap-1.5 rounded-card border border-line bg-primary-tint py-4">
                <Text className="text-[11px] font-semibold text-muted">⏰ 최근 인증</Text>
                <Text className="text-[20px] font-bold text-primary">{mockVerifyFeedback.bestTime}</Text>
              </View>
            </View>
            <Text className="text-center text-[11px] text-muted">주로 {mockVerifyFeedback.bestTime}에 인증했어요. 이 페이스 그대로! 💪</Text>
          </>
        ) : (
          <>
            <View className="h-20 w-20 items-center justify-center rounded-full bg-danger">
              <Text className="text-4xl text-white">!</Text>
            </View>
            <Text className="text-[22px] font-bold text-ink">재인증이 필요해요</Text>
            <Text className="text-center text-[15px] text-muted">실패가 아니에요 — 아래 항목이 확인되지 않았을 뿐이에요.</Text>

            <View className="w-full max-w-[280px] rounded-card bg-surface px-4 py-3">
              <Text className="mb-1.5 text-[11px] font-bold text-danger">확인되지 않은 점</Text>
              {mockRetryGuide.notConfirmed.map((r) => (
                <Text key={r} className="text-[11px] text-subtle">• {r}</Text>
              ))}
            </View>

            <View className="w-full max-w-[280px] rounded-card bg-primary-tint px-4 py-3">
              <Text className="mb-1.5 text-[11px] font-bold text-primary">이렇게 다시 찍어보세요</Text>
              {mockRetryGuide.tips.map((t) => (
                <Text key={t} className="text-[11px] text-muted">✓ {t}</Text>
              ))}
            </View>
          </>
        )}
      </View>

      {/* 액션 */}
      <View className="w-full gap-2">
        {isSuccess ? (
          <Pressable onPress={goToGroup} className="h-[52px] items-center justify-center rounded-pill bg-primary">
            <Text className="text-[15px] font-bold text-white">내 그룹으로</Text>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={() => router.replace('/verify/camera')} className="h-[52px] items-center justify-center rounded-pill bg-primary">
              <Text className="text-[15px] font-bold text-white">다시 촬영하기</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/report')} className="items-center py-2">
              <Text className="text-[11px] font-semibold text-danger">판정에 이의 있어요 · 재인증 요청</Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
