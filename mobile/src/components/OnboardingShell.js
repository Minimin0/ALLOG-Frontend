import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function OnboardingShell({
  step,
  total = 4,
  title,
  subtitle,
  onBack,
  onNext,
  nextLabel = "다음",
  canNext = true,
  children,
}) {
  return (
    <SafeAreaView
      style={s.screen}
      edges={step >= 1 && step <= 4 ? ["top"] : []}
    >
      <KeyboardAvoidingView
        style={s.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={s.head}>
            <Pressable onPress={onBack} style={s.back}>
              <Text style={s.arrow}>←</Text>
            </Pressable>
            <Text style={s.step}>STEP {step}</Text>
          </View>
          <View style={s.progress}>
            {Array.from({ length: total }, (_, index) => index + 1).map((i) => (
              <View key={i} style={[s.segment, i <= step && s.filled]} />
            ))}
          </View>
          <Text style={s.title}>{title}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
          <View style={s.form}>{children}</View>
        </ScrollView>
        <View style={s.footer}>
          <Pressable style={s.secondary} onPress={onBack}>
            <Text style={s.secondaryText}>이전</Text>
          </Pressable>
          <Pressable
            disabled={!canNext}
            style={[s.primary, !canNext && s.disabled]}
            onPress={onNext}
          >
            <Text style={[s.primaryText, !canNext && s.disabledText]}>
              {nextLabel}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f7f6f3" },
  scroll: { flex: 1 },
  content: {
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    padding: 20,
    paddingBottom: 24,
  },
  head: {
    height: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  back: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: { fontSize: 22 },
  step: { fontSize: 15 },
  progress: { flexDirection: "row", gap: 12, marginBottom: 20 },
  segment: {
    height: 3,
    flex: 1,
    borderRadius: 999,
    backgroundColor: "#bababa",
  },
  filled: { backgroundColor: "#000" },
  title: { fontSize: 25, lineHeight: 32.5, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 12, lineHeight: 19.2, color: "#666", marginBottom: 18 },
  form: { gap: 16 },
  footer: {
    width: "100%",
    maxWidth: 390,
    alignSelf: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 52,
    backgroundColor: "#f7f6f3",
  },
  secondary: {
    height: 55,
    minWidth: 90,
    borderRadius: 27.5,
    backgroundColor: "#e8e8e8",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontSize: 15, fontWeight: "700", color: "#4a4a4a" },
  primary: {
    height: 55,
    flex: 1,
    borderRadius: 27.5,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  disabled: { backgroundColor: "#dfe3e8" },
  disabledText: { color: "#8b919b" },
});
