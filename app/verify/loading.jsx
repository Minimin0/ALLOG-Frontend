import { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

import Mascot from '@/components/common/Mascot';
import { ApiError } from '@/services/api';
import {
  openTodayVerification,
  requestUploadIntent,
  submitVerification,
  uploadToPresignedUrl,
} from '@/services/verificationApi';
import { useGroupStore } from '@/stores/groupStore';
import { useVerificationStore } from '@/stores/verificationStore.js';
import { colors } from '@/theme';

const RING = 176;
const R = 83;
const CIRC = 2 * Math.PI * R;

function MascotRing() {
  const rot = useSharedValue(0);
  useEffect(() => {
    rot.value = withRepeat(withTiming(360, { duration: 1400, easing: Easing.linear }), -1);
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  return (
    <View style={{ width: RING, height: RING }} className="items-center justify-center">
      <Animated.View style={[{ position: 'absolute' }, style]}>
        <Svg width={RING} height={RING}>
          <Circle cx={88} cy={88} r={R} stroke={colors.line} strokeWidth={6} fill="none" />
          <Circle cx={88} cy={88} r={R} stroke={colors.primary} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={`${CIRC * 0.82} ${CIRC}`} />
        </Svg>
      </Animated.View>
      <View className="h-[128px] w-[128px] items-center justify-center overflow-hidden rounded-full bg-primary-tint">
        <Mascot size={92} animated />
      </View>
    </View>
  );
}

const IconSvg = ({ children }) => (
  <Svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke={colors.ink} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </Svg>
);
const FlagIcon = () => (
  <IconSvg><Path d="M6 21V4" /><Path d="M6 5h11l-2.5 3.5L17 12H6" /></IconSvg>
);
const KeyIcon = () => (
  <IconSvg><Circle cx={8} cy={12} r={3.5} /><Path d="M11.5 12H20M17 12v3M20 12v2.5" /></IconSvg>
);
const UploadIcon = () => (
  <IconSvg><Path d="M12 16V5M8.5 8.5L12 5l3.5 3.5" /><Rect x={4} y={16} width={16} height={4} rx={1.5} /></IconSvg>
);
const CheckIcon = () => (
  <IconSvg><Circle cx={12} cy={12} r={8.5} /><Path d="M8.5 12.2l2.4 2.4 4.6-5" /></IconSvg>
);

// 각 항목은 실제 백엔드 호출 한 단계다. 연출용 가짜 검사 목록이 아니다.
const STEPS = [
  { Icon: FlagIcon, title: '오늘 인증 슬롯 확인', sub: 'POST verifications/current' },
  { Icon: KeyIcon, title: '업로드 주소 발급', sub: 'presigned URL 요청' },
  { Icon: UploadIcon, title: '인증 사진 업로드', sub: '저장소로 직접 전송' },
  { Icon: CheckIcon, title: '인증 제출', sub: '서버에 제출 확정' },
];

export default function LoadingScreen() {
  const router = useRouter();
  const media = useVerificationStore((s) => s.media);
  const storedGroupId = useVerificationStore((s) => s.groupId);
  const [step, setStep] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let cancelled = false;
    const groupId = storedGroupId ?? useGroupStore.getState().currentGroup()?.groupId;

    const finish = (outcome) => {
      if (cancelled) return;
      useVerificationStore.getState().setOutcome(outcome);
      router.replace('/verify/result');
    };

    (async () => {
      if (!groupId || !media) {
        finish({ state: 'failed', step: 'open', errorCode: ApiError.UNKNOWN });
        return;
      }

      // 1) 오늘 슬롯 열기 — 인증 사진 저장소가 없어도 이 단계는 동작한다.
      const opened = await openTodayVerification(groupId);
      if (cancelled) return;
      if (!opened.ok) return finish({ state: 'failed', step: 'open', errorCode: opened.errorCode });
      setStep(1);

      // 2) signed upload URL — 저장소 미구성이면 여기서 503이 난다(정상적인 운영 상태).
      let blob;
      try {
        blob = await (await fetch(media.uri)).blob();
      } catch {
        return finish({ state: 'failed', step: 'read', errorCode: ApiError.UNKNOWN });
      }
      const intent = await requestUploadIntent(groupId, {
        contentType: media.contentType ?? 'image/jpeg',
        sizeBytes: blob.size,
      });
      if (cancelled) return;
      if (!intent.ok) {
        return finish({
          state: intent.errorCode === ApiError.SERVICE_UNAVAILABLE ? 'unavailable' : 'failed',
          step: 'upload-intent',
          errorCode: intent.errorCode,
        });
      }
      setStep(2);

      // 3) 저장소로 직접 PUT
      const uploaded = await uploadToPresignedUrl(intent.data, blob);
      if (cancelled) return;
      if (!uploaded.ok) return finish({ state: 'failed', step: 'upload', errorCode: uploaded.errorCode });
      setStep(3);

      // 4) 제출 확정 — 여기서 끝나도 '승인'이 아니라 '제출됨'이다. 판정은 백엔드가 한다.
      const submitted = await submitVerification(groupId);
      if (cancelled) return;
      if (!submitted.ok) {
        return finish({
          state: submitted.errorCode === ApiError.SERVICE_UNAVAILABLE ? 'unavailable' : 'failed',
          step: 'submit',
          errorCode: submitted.errorCode,
        });
      }
      setStep(4);

      await useGroupStore.getState().loadGroup(groupId);
      finish({ state: 'submitted', step: 'submit', errorCode: null, data: submitted.data });
    })();

    return () => {
      cancelled = true;
    };
  }, [media, storedGroupId, router]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg px-5">
      <View className="mt-6 items-center">
        <MascotRing />
        <Text className="mt-6 text-center text-[20px] font-bold text-ink">인증을 제출하고 있어요.</Text>
        <Text className="mt-2 text-center text-[20px] font-medium text-muted">잠시만 기다려주세요.</Text>
      </View>

      <View className="mt-8 rounded-[35px] border border-line bg-surface px-2">
        {STEPS.map(({ Icon, title, sub }, i) => {
          const done = i < step;
          const loading = i === step;
          return (
            <View
              key={title}
              className={`flex-row items-center gap-3 px-3 py-4 ${i < STEPS.length - 1 ? 'border-b border-line' : ''}`}
            >
              <Icon />
              <View className="flex-1">
                <Text className="text-[15px] font-semibold text-ink">{title}</Text>
                <Text className="text-[10px] font-medium text-muted">{sub}</Text>
              </View>
              {done ? (
                <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <Text className="text-xs text-white">✓</Text>
                </View>
              ) : loading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <View className="h-6 w-6 rounded-full border-2 border-line" />
              )}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
