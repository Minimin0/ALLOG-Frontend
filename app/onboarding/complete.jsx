import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 온보딩 완료 (웹 OnboardingCompletePage 포팅).
export default function OnboardingCompleteScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg px-5">
      <View className="flex-1 items-center pt-16">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Text className="text-[28px] text-white">✓</Text>
        </View>

        <Text className="mt-6 text-center text-[25px] font-bold text-ink" style={{ lineHeight: 32 }}>환영합니다!{'\n'}하트 3개를 받았어요.</Text>

        <View className="mt-6 flex-row gap-3">
          <Text className="text-[34px] text-[#d9573b]">♥</Text>
          <Text className="text-[34px] text-[#d9573b]">♥</Text>
          <Text className="text-[34px] text-[#d9573b]">♥</Text>
        </View>

        <Text className="mt-6 text-center text-[18px] font-semibold text-subtle">
          <Text className="font-bold text-[#d9573b]">하트</Text>는 <Text className="font-bold text-ink">그룹 참가</Text>에만 사용돼요.
        </Text>

        <View className="mt-6 w-full gap-4 rounded-[23px] border border-line bg-surface p-5">
          <Text className="text-center text-[13px] font-semibold text-subtle">
            그룹에 참가할 때 <Text className="font-bold text-[#d9573b]">하트 1개</Text>를 사용해요.
          </Text>
          <View className="h-px w-full bg-line" />
          <View className="flex-row items-center justify-between gap-2">
            <Text className="flex-1 text-center text-[13px] font-semibold text-subtle" style={{ lineHeight: 20 }}>그룹 공동 성공률 80% 이상{'\n'}+{'\n'}개인 달성율 70% 이상</Text>
            <Text className="text-[16px] text-subtle">→</Text>
            <Text className="flex-1 text-center text-[13px] font-semibold text-[#d9573b]" style={{ lineHeight: 20 }}>하트 1개를{'\n'}다시 받아요.</Text>
          </View>
        </View>
      </View>

      <View className="pb-7">
        <Pressable onPress={() => router.replace('/home')} className="w-full items-center justify-center rounded-[27.5px] bg-primary py-[18px]">
          <Text className="text-[15px] font-bold text-white">홈으로 가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
