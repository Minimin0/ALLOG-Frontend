import { useEffect, useRef } from "react";
import { Animated, Easing, Platform } from "react-native";

export default function AnimatedEntrance({
  children,
  delay = 0,
  distance = 12,
  duration = 300,
  style,
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (
      Platform.OS === "web" &&
      globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      progress.setValue(1);
      return;
    }
    Animated.timing(progress, {
      toValue: 1,
      delay,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [delay, duration, progress]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
