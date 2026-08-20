import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export default function AnimatedEntrance({ children, delay = 0, distance = 12, duration = 300, style }) {
  const progress = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(reduceMotion ? 1 : 0);
    if (!isFocused || reduceMotion) return undefined;
    const animation = Animated.timing(progress, {
      toValue: 1,
      delay,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, duration, isFocused, progress, reduceMotion]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [{
            translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [distance, 0] }),
          }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
