import { useWindowDimensions, View } from "react-native";
import { colors } from "../theme";

export default function DesignScreen({
  children,
  backgroundColor = colors.bg,
}) {
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / 393, height / 852);
  return (
    <View style={{ flex: 1, backgroundColor, alignItems: "center" }}>
      <View
        style={{
          width: 393 * scale,
          height: 852 * scale,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 393,
            height: 852,
            backgroundColor,
            transform: [{ scale }],
            transformOrigin: "top left",
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}
