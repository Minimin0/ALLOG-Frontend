import { useEffect, useRef } from "react";
import { Animated, Easing, Platform } from "react-native";
import { useIsFocused } from "@react-navigation/native";

export default function AnimatedEntrance({
  children,
  delay = 0,
  distance = 12,
  duration = 300,
  style,
}) {
  const progress = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    if (!isFocused) return undefined;
    if (
      Platform.OS === "web" &&
      globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      progress.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(progress, {
      toValue: 1,
      delay,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [delay, duration, isFocused, progress]);

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
