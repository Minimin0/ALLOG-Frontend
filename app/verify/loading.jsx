import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

import Mascot from '@/components/common/Mascot';
import { useVerificationStore } from '@/stores/verificationStore.js';

const RING = 176;
const R = 83;
const CIRC = 2 * Math.PI * R;

// 마스코트 + 회전하는 진행 링 (웹 conic-gradient 스피너 → Reanimated 회전 SVG 아크).
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
          <Circle cx={88} cy={88} r={R} stroke="#e7e3d8" strokeWidth={6} fill="none" />
          <Circle cx={88} cy={88} r={R} stroke="#14453a" strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={`${CIRC * 0.82} ${CIRC}`} />
        </Svg>
      </Animated.View>
      <View className="h-[128px] w-[128px] items-center justify-center overflow-hidden rounded-full bg-primary-tint">
        <Mascot size={92} animated />
      </View>
    </View>
  );
}

const MOCK_RESULT = 'success'; // 'success' | 'retry'

// 검사 항목 아이콘 (웹 VerificationLoadingPage 의 SVG outline 아이콘 그대로 포팅).
const IconSvg = ({ children }) => (
  <Svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="#111111" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </Svg>
);
const PictureIcon = () => (
  <IconSvg>
    <Rect x={3} y={4} width={18} height={16} rx={2.5} />
    <Circle cx={8.5} cy={9} r={1.4} />
    <Path d="M4 17l4.5-4.5 3.5 3.5 3-3 5 5" />
  </IconSvg>
);
const FlagIcon = () => (
  <IconSvg>
    <Path d="M6 21V4" />
    <Path d="M6 5h11l-2.5 3.5L17 12H6" />
  </IconSvg>
);
const ClockIcon = () => (
  <IconSvg>
    <Circle cx={12} cy={12} r={8.5} />
    <Path d="M12 7.5V12l3 2" />
  </IconSvg>
);
const ImagePlusIcon = () => (
  <IconSvg>
    <Rect x={3} y={5} width={13} height={13} rx={2.5} />
    <Circle cx={7.5} cy={9.5} r={1.2} />
    <Path d="M4 16l3.5-3.5 3 3" />
    <Path d="M18.5 5.5v5M16 8h5" />
  </IconSvg>
);

const CHECK_ITEMS = [
  { Icon: PictureIcon, title: '영상 품질 확인', sub: '선명도와 구도 확인' },
  { Icon: FlagIcon, title: '챌린지 일치 여부 확인', sub: '챌린지 조건 확인' },
  { Icon: ClockIcon, title: '촬영 시간 확인', sub: '오늘 촬영된 동영상인지 확인' },
  { Icon: ImagePlusIcon, title: '중복 이미지 검사', sub: '이전에 제출한 사진과 비교' },
];

// AI 분석 화면 (웹 VerificationLoadingPage 포팅). 4개 항목이 순차 완료 → 결과로.
export default function LoadingScreen() {
  const router = useRouter();
  const setResult = useVerificationStore((s) => s.setResult);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= CHECK_ITEMS.length) {
      setResult(MOCK_RESULT);
      const t = setTimeout(() => router.replace('/verify/result'), 400);
      return () => clearTimeout(t);
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg px-5">
      <View className="mt-6 items-center">
        {/* 마스코트 + 회전 진행 링 */}
        <MascotRing />

        <Text className="mt-6 text-center text-[20px] font-bold text-ink">AI 가 인증 내용을 분석하고 있어요.</Text>
        <Text className="mt-2 text-center text-[20px] font-medium text-muted">잠시만 기다려주세요.</Text>
      </View>

      {/* 검사 항목 카드 */}
      <View className="mt-8 rounded-[35px] border border-line bg-surface px-2">
        {CHECK_ITEMS.map(({ Icon, title, sub }, i) => {
          const done = i < step;
          const loading = i === step;
          return (
            <View
              key={title}
              className={`flex-row items-center gap-3 px-3 py-4 ${i < CHECK_ITEMS.length - 1 ? 'border-b border-line' : ''}`}
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
                <ActivityIndicator size="small" color="#14453a" />
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
