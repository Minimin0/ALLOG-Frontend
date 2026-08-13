import { useEffect } from 'react';
import { Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

// 실제 마스코트 이미지 (assets/images/mascot.png).
// animated=true 이면 새싹처럼 살랑살랑 흔들리며 살아있는 느낌을 준다.
const MASCOT = require('../../../assets/images/mascot.png');
const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Mascot({ size = 40, style, animated = false }) {
  const t = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      t.value = withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.ease) }), -1, true);
    }
  }, [animated]);

  const aStyle = useAnimatedStyle(() => {
    if (!animated) return {};
    return {
      transform: [
        { translateY: -t.value * 3 },
        { rotate: `${-6 + t.value * 12}deg` },
      ],
    };
  });

  return (
    <AnimatedImage
      source={MASCOT}
      resizeMode="contain"
      style={[{ width: size, height: size }, aStyle, style]}
    />
  );
}
