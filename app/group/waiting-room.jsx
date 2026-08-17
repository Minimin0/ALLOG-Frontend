import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 대기실 (웹 WaitingRoomPage 포팅 — 간단 화면).
export default function WaitingRoomScreen() {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center gap-6 bg-bg px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-tint">
        <Text className="text-3xl">⏳</Text>
      </View>
      <Text className="text-center text-[19px] font-bold text-ink" style={{ lineHeight: 28 }}>대기실{'\n'}멤버들을 기다리고 있어요.</Text>
      <Pressable onPress={() => router.replace('/group')} className="w-full items-center justify-center rounded-[27.5px] bg-primary py-4">
        <Text className="text-[15px] font-bold text-white">그룹 홈으로 이동</Text>
      </Pressable>
    </SafeAreaView>
  );
}
