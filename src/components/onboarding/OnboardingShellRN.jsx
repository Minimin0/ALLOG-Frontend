import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';

export default function OnboardingShellRN({ step, total = 4, title, subtitle, canNext = true, nextLabel = '다음', onBack, onNext, children }) {
  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <KeyboardAvoidingView style={s.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={s.scroll} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
          <View style={s.head}>
            <Pressable onPress={onBack} style={s.back} accessibilityLabel="이전 화면"><Text style={s.arrow}>←</Text></Pressable>
            <Text style={s.step}>STEP {step}</Text>
          </View>
          <View style={s.progress} accessibilityLabel={`${total}단계 중 ${step}단계`}>
            {Array.from({ length: total }, (_, index) => index + 1).map((item) => <View key={item} style={[s.segment, item <= step && s.filled]} />)}
          </View>
          <Text style={s.title}>{title}</Text>
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
          <View style={s.form}>{children}</View>
        </ScrollView>
        <View style={s.footer}>
          <Pressable style={s.secondary} onPress={onBack}><Text style={s.secondaryText}>이전</Text></Pressable>
          <Pressable disabled={!canNext} style={[s.primary, !canNext && s.disabled]} onPress={onNext}>
            <Text style={[s.primaryText, !canNext && s.disabledText]}>{nextLabel}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { width: '100%', maxWidth: 390, alignSelf: 'center', padding: 20, paddingBottom: 24 },
  head: { height: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  back: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  arrow: { fontSize: 22, color: colors.ink }, step: { fontSize: 15, color: colors.ink },
  progress: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  segment: { height: 3, flex: 1, borderRadius: 999, backgroundColor: colors.disabled }, filled: { backgroundColor: colors.black },
  title: { fontSize: 25, lineHeight: 32.5, fontWeight: '700', marginBottom: 8, color: colors.ink },
  subtitle: { fontSize: 12, lineHeight: 19.2, color: colors.muted, marginBottom: 18 }, form: { gap: 16 },
  footer: { width: '100%', maxWidth: 390, alignSelf: 'center', flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, backgroundColor: colors.bg },
  secondary: { height: 55, minWidth: 90, borderRadius: 27.5, backgroundColor: '#e8e8e8', alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontSize: 15, fontWeight: '700', color: colors.subtle },
  primary: { height: 55, flex: 1, borderRadius: 27.5, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  primaryText: { fontSize: 15, fontWeight: '700', color: colors.white }, disabled: { backgroundColor: '#dfe3e8' }, disabledText: { color: '#8b919b' },
});
