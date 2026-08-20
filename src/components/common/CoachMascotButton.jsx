import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing, runOnJS } from 'react-native-reanimated';

import Mascot from '@/components/common/Mascot';
import { colors } from '@/theme';

// 우측 상단 코치 캐릭터: 누르면 한 번 폴짝 뛴 뒤 AI 코칭으로 이동 (웹 hop 애니 포팅).
// bare=true면 원형 배지 없이 캐릭터만 떠 있는 형태로 렌더링한다.
export default function CoachMascotButton({ to = '/ai', circle = 54, size = 44, bare = false, style: outerStyle }) {
  const router = useRouter();
  const y = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  const go = () => router.push(to);

  const onPress = () => {
    y.value = withSequence(
      withTiming(-14, { duration: 130, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 220, easing: Easing.bounce }, (finished) => {
        if (finished) runOnJS(go)();
      }),
    );
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="AI 코칭 열기"
      style={[
        bare
          ? { width: size, height: size, alignItems: 'center', justifyContent: 'center' }
          : { width: circle, height: circle, borderRadius: circle / 2, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
        outerStyle,
      ]}
    >
      <Animated.View style={style}>
        <Mascot size={size} />
      </Animated.View>
    </Pressable>
  );
}
