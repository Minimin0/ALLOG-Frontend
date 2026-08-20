import { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import AiMessageRN from '@/components/ai/AiMessageRN';
import BottomNavBar from '@/components/nav/BottomNavBar';
import { ApiError } from '@/services/api';
import { fetchAiCoach, fetchAiCoachFollowUp } from '@/services/aiApi';
import { useGroupStore } from '@/stores/groupStore';
import { colors } from '@/theme';

// AI 코칭. GET /api/v1/groups/{groupId}/ai-coach가 authority다.
// dev preview 엔드포인트는 일반 배포에 없으므로 쓰지 않는다.
// provider 키가 없으면 백엔드가 TEMPLATE으로 degrade해서 답한다 — 그것도 정상 응답이다.
const ACTION_ROUTE = {
  OPEN_CERTIFICATION: '/verify',
  OPEN_GROUP: '/group',
  OPEN_PROGRESS: '/group',
  OPEN_EXPLORE: '/explore',
};

export default function AiCoachScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const paramGroupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId;

  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorCode, setErrorCode] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [pendingQuestionId, setPendingQuestionId] = useState(null);
  const scrollRef = useRef(null);
  const followUpKeyRef = useRef(0);

  const load = useCallback(async () => {
    setLoading(true);
    setFollowUps([]);
    const store = useGroupStore.getState();
    if (store.myGroups.length === 0) await store.loadMyGroups();
    const groupId = paramGroupId ?? store.currentGroup()?.groupId;

    if (!groupId) {
      setErrorCode(ApiError.NOT_FOUND);
      setLoading(false);
      return;
    }

    const response = await fetchAiCoach(groupId);
    setCoach(response.ok ? response.data : null);
    setErrorCode(response.ok ? null : response.errorCode);
    setLoading(false);
  }, [paramGroupId]);

  const ask = async (question) => {
    if (pendingQuestionId) return;
    const store = useGroupStore.getState();
    const groupId = paramGroupId ?? store.currentGroup()?.groupId;
    if (!groupId) return;

    const key = ++followUpKeyRef.current;
    setPendingQuestionId(question.id);
    setFollowUps((current) => [...current, { key, questionId: question.id, label: question.label, answer: null, failed: false }]);
    let response;
    try {
      response = await fetchAiCoachFollowUp(groupId, question.id);
    } catch {
      response = { ok: false };
    }
    setFollowUps((current) => current.map((item) => item.key === key
      ? { ...item, answer: response.ok ? response.data : null, failed: !response.ok }
      : item));
    setPendingQuestionId(null);
  };

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [coach, followUps, pendingQuestionId]);

  const actionRoute = coach?.actionType ? ACTION_ROUTE[coach.actionType] : null;

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      {/* 헤더 */}
      <View className="relative h-14 flex-row items-center justify-center border-b border-line px-4">
        <Pressable onPress={() => router.back()} className="absolute left-4 h-9 w-9 items-center justify-center rounded-xl bg-ink">
          <Text className="text-white">‹</Text>
        </Pressable>
        <Text className="text-[17px] font-bold text-ink">AI 코칭</Text>
      </View>

      {/* 코칭 내용 */}
      <ScrollView ref={scrollRef} className="flex-1" contentContainerClassName="gap-3 p-4">
        {loading ? (
          <View className="items-center py-10">
            <ActivityIndicator color={colors.spinner} />
          </View>
        ) : coach ? (
          <>
            {coach.title ? (
              <Animated.View entering={FadeInUp.duration(300)}>
                <Text className="px-1 text-[13px] font-bold text-primary">{coach.title}</Text>
              </Animated.View>
            ) : null}
            <Animated.View entering={FadeInUp.duration(300)}>
              <AiMessageRN text={coach.message} />
            </Animated.View>
            {coach.routineState || coach.insightType ? (
              <View className="mx-1 flex-row flex-wrap gap-2">
                {coach.routineState ? (
                  <View className="rounded-pill bg-primary-tint px-3 py-1.5">
                    <Text className="text-[11px] font-semibold text-primary">{coach.routineState}</Text>
                  </View>
                ) : null}
                {coach.insightType ? (
                  <View className="rounded-pill bg-surface px-3 py-1.5" style={{ borderWidth: 1, borderColor: colors.line }}>
                    <Text className="text-[11px] font-semibold text-muted">{coach.insightType}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            {followUps.map((item) => (
              <View key={item.key} className="gap-2">
                <View className="max-w-[80%] self-end rounded-2xl bg-primary px-4 py-3">
                  <Text className="text-[15px] leading-6 text-white">{item.label}</Text>
                </View>
                {item.answer ? <AiMessageRN text={item.answer.message} /> : item.failed ? (
                  <View className="ml-11 max-w-[80%] rounded-2xl border border-line bg-surface px-4 py-3">
                    <Text className="text-[13px] font-semibold text-danger">답변을 가져오지 못했어요.</Text>
                    <Pressable onPress={() => ask({ id: item.questionId, label: item.label })} className="mt-2 self-start rounded-pill bg-primary-tint px-3 py-1.5">
                      <Text className="text-[12px] font-bold text-primary">다시 시도</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View className="items-start pl-12"><ActivityIndicator color={colors.spinner} /></View>
                )}
              </View>
            ))}
          </>
        ) : (
          <View className="items-center gap-2 py-10">
            <Text className="text-[15px] font-bold text-ink">
              {errorCode === ApiError.NOT_FOUND ? '참여 중인 그룹이 없어요' : '코치를 불러오지 못했어요'}
            </Text>
            <Text className="text-center text-[13px] text-muted">
              {errorCode === ApiError.NOT_FOUND
                ? '그룹에 참가하면 AI 코치가 말을 걸어드려요.'
                : errorCode === ApiError.NETWORK
                  ? '서버에 연결할 수 없어요.'
                  : '잠시 후 다시 시도해주세요.'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 액션 — 문구와 이동 지점 모두 백엔드가 정한다 */}
      <View className="border-t border-line p-3">
        {coach?.suggestedQuestions?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pb-3">
            {coach.suggestedQuestions.map((question) => (
              <Pressable
                key={question.id}
                disabled={!!pendingQuestionId}
                onPress={() => ask(question)}
                className={`flex-row items-center gap-2 rounded-pill border border-line bg-surface px-4 py-2 ${pendingQuestionId ? 'opacity-50' : ''}`}
              >
                <Text className="text-[13px] font-semibold text-ink">{question.label}</Text>
                {pendingQuestionId === question.id ? <ActivityIndicator size="small" color={colors.spinner} /> : null}
              </Pressable>
            ))}
          </ScrollView>
        ) : null}
        <View className="flex-row gap-2">
          {coach?.actionLabel && actionRoute ? (
            <Pressable onPress={() => router.push(actionRoute)} className="h-11 flex-1 items-center justify-center rounded-pill bg-black">
              <Text className="text-[15px] font-bold text-white" numberOfLines={1}>{coach.actionLabel}</Text>
            </Pressable>
          ) : null}
          <Pressable disabled={!!pendingQuestionId} onPress={load} className={`h-11 items-center justify-center rounded-pill bg-primary-tint px-5 ${pendingQuestionId ? 'opacity-50' : ''}`}>
            <Text className="text-[15px] font-medium text-primary">새로고침</Text>
          </Pressable>
        </View>
      </View>

      <BottomNavBar />
    </SafeAreaView>
  );
}
