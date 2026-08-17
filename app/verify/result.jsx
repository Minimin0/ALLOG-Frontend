import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing } from 'react-native-reanimated';

import Mascot from '@/components/common/Mascot';
import { ApiError } from '@/services/api';
import { useGroupStore } from '@/stores/groupStore';
import { useVerificationStore } from '@/stores/verificationStore.js';

// 인증 결과. 제출이 끝났다는 것과 승인됐다는 것은 다르다 —
// AI 판정은 백엔드에서 비동기로 일어나므로 여기서 "성공"이라고 단정하지 않는다.
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
];

function failureMessage(errorCode) {
  switch (errorCode) {
    case ApiError.NETWORK:
      return '서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.';
    case ApiError.VALIDATION:
      return '이 사진은 올릴 수 없어요. 용량이나 형식을 확인해주세요.';
    case ApiError.CONFLICT:
      return '이미 오늘 인증을 제출했거나, 지금은 제출할 수 없는 상태예요.';
    case ApiError.NOT_FOUND:
      return '이 그룹의 오늘 인증을 찾을 수 없어요.';
    case ApiError.UNAUTHORIZED:
      return '로그인이 만료됐어요. 다시 로그인해주세요.';
    default:
      return '인증을 제출하지 못했어요. 잠시 후 다시 시도해주세요.';
  }
}

export default function ResultScreen() {
  const router = useRouter();
  const outcome = useVerificationStore((s) => s.outcome);
  const reset = useVerificationStore((s) => s.reset);
  const progress = useGroupStore((s) => s.progress);
  const [praise] = useState(() => PRAISES[Math.floor(Math.random() * PRAISES.length)]);

  const state = outcome?.state ?? 'failed';
  const personal = progress?.personal ?? null;

  const goToGroup = () => {
    reset();
    router.replace('/group');
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center bg-bg p-6">
      <View className="flex-1 items-center justify-center gap-4">
        {state === 'submitted' && (
          <>
            <View className="rounded-2xl bg-surface px-4 py-2.5 shadow" style={{ borderWidth: 1, borderColor: '#e7e3d8' }}>
              <Text className="text-[15px] font-semibold text-ink">{praise}</Text>
            </View>

            <View className="h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-primary-tint">
              <HopMascot size={120} />
            </View>
            <Text className="text-[22px] font-bold text-ink">인증 제출 완료!</Text>
            <Text className="text-center text-[13px] text-muted">
              결과는 검토가 끝나면 그룹 화면에 반영돼요.
            </Text>

            {personal && (
              <View className="w-full max-w-[280px] flex-row gap-2">
                <View className="flex-1 rounded-card bg-primary-tint px-3 py-2.5">
                  <Text className="text-[11px] text-muted">연속 성공</Text>
                  <Text className="text-[22px] font-bold text-primary">{personal.currentStreak}<Text className="text-[11px] font-bold">일 🔥</Text></Text>
                </View>
                <View className="flex-1 rounded-card bg-primary-tint px-3 py-2.5">
                  <Text className="text-[11px] text-muted">누적 완료</Text>
                  <Text className="pt-1 text-[15px] font-bold text-primary">{personal.completedCount}/{personal.requiredCompletionCount}회</Text>
                </View>
              </View>
            )}
          </>
        )}

        {/* 저장소 미구성(503)은 사용자 잘못이 아니라 배포 단계의 문제다. 실패로 표시하지 않는다. */}
        {state === 'unavailable' && (
          <>
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary-tint">
              <Text className="text-4xl">🛠️</Text>
            </View>
            <Text className="text-[22px] font-bold text-ink">사진 인증은 준비 중이에요</Text>
            <Text className="text-center text-[15px] text-muted">
              인증 사진 저장소가 아직 연결되지 않았어요.{'\n'}오늘 인증 기록 자체는 만들어져 있어요.
            </Text>
          </>
        )}

        {state === 'failed' && (
          <>
            <View className="h-20 w-20 items-center justify-center rounded-full bg-danger">
              <Text className="text-4xl text-white">!</Text>
            </View>
            <Text className="text-[22px] font-bold text-ink">인증을 제출하지 못했어요</Text>
            <Text className="text-center text-[15px] text-muted">{failureMessage(outcome?.errorCode)}</Text>
          </>
        )}
      </View>

      <View className="w-full gap-2">
        {state === 'failed' ? (
          <>
            <Pressable onPress={() => router.replace('/verify/camera')} className="h-[52px] items-center justify-center rounded-pill bg-primary">
              <Text className="text-[15px] font-bold text-white">다시 촬영하기</Text>
            </Pressable>
            <Pressable onPress={goToGroup} className="items-center py-2">
              <Text className="text-[13px] font-semibold text-muted">내 그룹으로</Text>
            </Pressable>
          </>
        ) : (
          <Pressable onPress={goToGroup} className="h-[52px] items-center justify-center rounded-pill bg-primary">
            <Text className="text-[15px] font-bold text-white">내 그룹으로</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
