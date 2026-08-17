import { Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming, Easing, runOnJS } from 'react-native-reanimated';

import Mascot from '@/components/common/Mascot';

// 우측 상단 코치 캐릭터: 누르면 한 번 폴짝 뛴 뒤 AI 코칭으로 이동 (웹 hop 애니 포팅).
export default function CoachMascotButton({ onPress: navigate, circle = 54, size = 44, style: outerStyle }) {
  const y = useSharedValue(0);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));

  const onPress = () => {
    y.value = withSequence(
      withTiming(-14, { duration: 130, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 220, easing: Easing.bounce }, (finished) => {
        if (finished && navigate) runOnJS(navigate)();
      }),
    );
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel="AI 코칭 열기"
      style={[
        { width: circle, height: circle, borderRadius: circle / 2, backgroundColor: '#edf2ec', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
        outerStyle,
      ]}
    >
      <Animated.View style={style}>
        <Mascot size={size} />
      </Animated.View>
    </Pressable>
  );
}
