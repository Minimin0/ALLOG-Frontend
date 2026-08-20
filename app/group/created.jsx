import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

// 그룹 생성 완료 (웹 GroupCreatedPage 포팅).
export default function GroupCreatedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = Array.isArray(params.groupId) ? params.groupId[0] : params.groupId;
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const capacity = Array.isArray(params.capacity) ? params.capacity[0] : params.capacity;
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 items-center justify-center gap-6 bg-bg px-8">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Text className="text-[28px] text-white">✓</Text>
      </View>
      <Text className="text-center text-[19px] font-bold text-ink" style={{ lineHeight: 28 }}>
        {name ? `'${name}' 그룹이 생성되었어요!` : '그룹이 생성되었어요!'}
        {'\n'}
        {capacity ? `${capacity}명이 모이면 시작돼요.` : '멤버들이 모이면 시작돼요.'}
      </Text>
      <Pressable onPress={() => router.replace(groupId ? { pathname: '/group/waiting-room', params: { groupId } } : '/group/waiting-room')} className="w-full items-center justify-center rounded-[27.5px] bg-ink py-4">
        <Text className="text-[15px] font-bold text-white">대기실로 이동</Text>
      </Pressable>
    </SafeAreaView>
  );
}
