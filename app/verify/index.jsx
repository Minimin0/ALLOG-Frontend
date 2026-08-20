import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Rect, Path } from 'react-native-svg';

import BottomNavBar from '@/components/nav/BottomNavBar';
import { ApiError } from '@/services/api';
import { openTodayVerification } from '@/services/verificationApi';
import { useGroupStore } from '@/stores/groupStore';
import { useVerificationStore } from '@/stores/verificationStore.js';
import { colors } from '@/theme';

// 영상 아이콘 (이모지는 기기별 폰트 미지원 시 깨져 보일 수 있어 벡터로).
function VideoIcon({ size = 24, color = colors.ink }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={2} y={5} width={15} height={14} rx={2.5} />
      <Path d="M17 9l5-3v12l-5-3z" />
    </Svg>
  );
}

const STATUS_TEXT = {
  PENDING_UPLOAD: '아직 오늘 인증을 안했어요.',
  SUBMITTED: '제출했어요. 검토를 기다리는 중이에요.',
  PROCESSING: '검토하고 있어요.',
  APPROVED: '오늘 인증이 승인됐어요!',
  REVIEW_REQUIRED: '추가 확인이 필요해요.',
  RETRY_REQUIRED: '다시 인증해주세요.',
  REJECTED: '인증이 거절됐어요.',
  INVALIDATED: '이 인증은 무효 처리됐어요.',
};

// 오늘의 인증 시작 화면. 오늘 슬롯은 POST(GET 아님)로 열린다 — 없으면 만들어준다.
export default function VerifyStartScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const paramGroupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId;

  const detail = useGroupStore((s) => s.detail);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const store = useGroupStore.getState();
      if (store.myGroups.length === 0) await store.loadMyGroups();
      const groupId = paramGroupId ?? store.currentGroup()?.groupId;

      if (!groupId) {
        setError(ApiError.NOT_FOUND);
        setLoading(false);
        return;
      }

      useVerificationStore.getState().setGroupId(groupId);
      if (!store.detail || String(store.detail.group?.groupId) !== String(groupId)) {
        await store.loadGroup(groupId);
      }

      const response = await openTodayVerification(groupId);
      setVerification(response.ok ? response.data : null);
      setError(response.ok ? null : response.errorCode);
      setLoading(false);
    })();
  }, [paramGroupId]);

  const goCamera = () => {
    useVerificationStore.getState().reset();
    router.push('/verify/camera');
  };

  const alreadyDone = verification && verification.status !== 'PENDING_UPLOAD' && verification.status !== 'RETRY_REQUIRED';

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="relative h-10 flex-row items-center justify-center px-5">
        <Pressable onPress={() => router.back()} className="absolute left-5 h-10 w-10 items-center justify-center rounded-xl bg-ink">
          <Text className="text-lg text-white">‹</Text>
        </Pressable>
        <Text className="text-[17px] font-bold text-ink">오늘의 인증</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="pb-6 pt-2">
        <View className="mx-auto w-[86%] items-center rounded-card bg-surface p-5 shadow-sm">
          {loading ? (
            <ActivityIndicator color={colors.spinner} />
          ) : (
            <>
              <Text className="text-[12px] font-bold text-primary">{verification?.scheduledDate ?? '오늘'}</Text>
              <Text className="text-[22px] font-bold text-ink">{detail?.group?.name ?? '오늘의 루틴'}</Text>
              <Text className="mt-1 text-[12px] font-medium text-muted">
                {error === ApiError.NOT_FOUND
                  ? '참여 중인 그룹이 없어요.'
                  : error
                    ? '인증 상태를 불러오지 못했어요.'
                    : STATUS_TEXT[verification?.status] ?? ''}
              </Text>
            </>
          )}
        </View>

        <Pressable onPress={goCamera} disabled={loading || !!error} className={`mt-5 h-[320px] items-center justify-center gap-3 rounded-card bg-line ${loading || error ? 'opacity-50' : ''}`}>
          <View className="h-16 w-16 items-center justify-center rounded-full bg-surface">
            <VideoIcon size={28} color={colors.ink} />
          </View>
          <Text className="text-[15px] font-medium text-ink">동영상 촬영</Text>
        </Pressable>

        <View className="mt-5 rounded-card bg-primary-tint p-5">
          <Text className="mb-3 text-[17px] font-bold text-ink">인증 가이드</Text>
          <View className="gap-2">
            <Text className="text-[15px] text-muted">• 오늘 촬영한 영상만 인증 가능합니다.</Text>
            <Text className="text-[15px] text-muted">• 얼굴은 가려도 괜찮습니다.</Text>
            <Text className="text-[15px] text-muted">• 루틴을 실천한 모습이 잘 보이도록 촬영해주세요.</Text>
          </View>
          <View className="mt-3 flex-row items-center gap-2 rounded-item bg-surface px-3 py-2">
            <VideoIcon size={16} color={colors.primary} />
            <Text className="flex-1 text-[11px] text-muted">
              영상은 기기에만 임시 보관되고, 인증에는 <Text className="font-bold text-primary">사진 한 장만 제출</Text>돼요.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={goCamera}
          disabled={loading || !!error || alreadyDone}
          className={`mt-5 h-[52px] items-center justify-center rounded-pill bg-primary ${loading || error || alreadyDone ? 'opacity-50' : ''}`}
        >
          <Text className="text-[15px] font-bold text-white">{alreadyDone ? '오늘 인증 완료' : '인증하기'}</Text>
        </Pressable>
      </ScrollView>

      <BottomNavBar />
    </SafeAreaView>
  );
}
