import { useEffect, useRef } from "react";
import { Animated, Pressable } from "react-native";

export default function CoachMascotButton({ source, size = 54, onPress }) {
  const hop = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1.025,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(hop, {
        toValue: -12,
        duration: 130,
        useNativeDriver: true,
      }),
      Animated.spring(hop, {
        toValue: 0,
        speed: 18,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => finished && onPress?.());
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="AI 코치 열기"
      onPress={handlePress}
    >
      <Animated.Image
        source={source}
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
