import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 하위 화면 임시 플레이스홀더 (뒤로가기 헤더 포함). 다음 배치에서 실제 포팅.
export default function SubPagePlaceholder({ title }) {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-full border border-line bg-surface">
          <Text className="text-xl text-ink">‹</Text>
        </Pressable>
        <Text className="text-[19px] font-bold text-ink">{title}</Text>
      </View>
      <View className="flex-1 items-center justify-center px-8">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-tint">
          <Text className="text-3xl">🌱</Text>
        </View>
        <Text className="mt-4 text-center text-[15px] font-semibold text-muted">준비 중인 화면이에요.</Text>
      </View>
    </SafeAreaView>
  );
}
