import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { mockGroup } from '@/data/mockGroups.js';

// 그룹 초대 (웹 InviteGroupPage 포팅). 초대 코드 안내.
export default function InviteGroupScreen() {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center gap-6 bg-bg px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary-tint">
        <Text className="text-3xl">🔗</Text>
      </View>
      <Text className="text-center text-[19px] font-bold text-ink">그룹에 친구를 초대해요</Text>
      <View className="w-full items-center rounded-[20px] border border-line bg-surface py-6">
        <Text className="text-[12px] font-semibold text-muted">초대 코드</Text>
        <Text className="mt-1 text-[24px] font-bold tracking-widest text-primary">{mockGroup.inviteCode}</Text>
      </View>
      <Pressable onPress={() => router.back()} className="w-full items-center justify-center rounded-[27.5px] bg-primary py-4">
        <Text className="text-[15px] font-bold text-white">그룹으로 돌아가기</Text>
      </Pressable>
    </SafeAreaView>
  );
}
