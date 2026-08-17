import { useRef } from "react";
import { Animated, Pressable } from "react-native";

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export default function AnimatedPressable({
  style,
  onPressIn,
  onPressOut,
  ...props
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = (toValue) =>
    Animated.spring(scale, {
      toValue,
      speed: 35,
      bounciness: 2,
      useNativeDriver: true,
    }).start();

  return (
    <AnimatedPressableBase
      {...props}
      onPressIn={(event) => {
        animate(0.99);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        animate(1);
        onPressOut?.(event);
      }}
      style={[style, { transform: [{ scale }] }]}
    />
  );
}
