import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { getCoachImage } from '../../../mobile/src/utils/coach';
import { useUserStore } from '@/stores/userStore';

// 우측 상단 AI 코치 캐릭터. 팀원 최신 디자인(mobile/src/components/CoachMascotButton.js) 이식:
// 원형 배경 없이 캐릭터 이미지가 숨쉬듯 미세하게 커졌다 작아지고, 누르면 한 번 폴짝 뛴 뒤 이동한다.
// 어떤 캐릭터를 보여줄지는 백엔드 프로필(onboarding.coachStyle)이 결정한다.
const COACH_LABEL = {
  supportive: '응원형',
  pressuring: '압박형',
  fact_based: '팩트형',
  humorous: '유머형',
};

export default function CoachMascotButton({ to = '/ai', size = 54, style: outerStyle }) {
  const router = useRouter();
  const coachStyle = useUserStore((s) => s.profile?.onboarding?.coachStyle);
  const hop = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1.025, duration: 1500, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(hop, { toValue: -12, duration: 130, useNativeDriver: true }),
      Animated.spring(hop, { toValue: 0, speed: 18, bounciness: 8, useNativeDriver: true }),
    ]).start(({ finished }) => finished && router.push(to));
  };

  return (
    <Pressable accessibilityRole="button" accessibilityLabel="AI 코치 열기" onPress={handlePress} style={outerStyle}>
      <Animated.Image
        source={getCoachImage(COACH_LABEL[coachStyle])}
        resizeMode="contain"
        style={{
          width: size,
          height: size,
          transform: [{ translateY: hop }, { scale: breathe }],
        }}
      />
    </Pressable>
  );
}
