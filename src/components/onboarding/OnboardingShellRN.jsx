import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 온보딩 공용 레이아웃 (웹 OnboardingShell 포팅): 진행바 + 제목 + 내용 + 하단 다음.
export default function OnboardingShellRN({ step, total, title, subtitle, canNext, nextLabel = '다음', onBack, onNext, children }) {
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="px-6 pt-3">
        {onBack ? (
          <Pressable onPress={onBack} className="h-8 w-8 items-center justify-center">
            <Text className="text-2xl text-ink">‹</Text>
          </Pressable>
        ) : (
          <View className="h-8" />
        )}
        <View className="mt-2 h-1.5 w-full rounded-full bg-line">
          <View className="h-full rounded-full bg-primary" style={{ width: `${(step / total) * 100}%` }} />
        </View>
        <Text className="mt-5 text-[22px] font-bold text-ink">{title}</Text>
        {subtitle ? <Text className="mt-2 text-[13px] text-muted">{subtitle}</Text> : null}
      </View>

      <ScrollView className="flex-1 px-6" contentContainerClassName="py-6">
        {children}
      </ScrollView>

      <View className="px-6 pb-4">
        <Pressable
          onPress={canNext ? onNext : undefined}
          disabled={!canNext}
          className={`h-[52px] items-center justify-center rounded-pill ${canNext ? 'bg-primary' : 'bg-disabled'}`}
        >
          <Text className="text-[15px] font-bold text-white">{nextLabel}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
