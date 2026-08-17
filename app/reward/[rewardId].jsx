import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

// 리워드 상세 (웹 RewardDetailPage 포팅 — 간단 화면).
export default function RewardDetailScreen() {
  const router = useRouter();
  const { rewardId } = useLocalSearchParams();
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center gap-6 bg-bg px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-tint">
        <Text className="text-3xl">🎁</Text>
      </View>
      <Text className="text-center text-[19px] font-bold text-ink">리워드 상세{rewardId ? `\n(${rewardId})` : ''}</Text>
      <Pressable onPress={() => router.replace('/reward')} className="w-full items-center justify-center rounded-[27.5px] bg-primary py-4">
        <Text className="text-[15px] font-bold text-white">리워드 목록으로</Text>
      </Pressable>
    </SafeAreaView>
  );
}
