import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Icon from '@/components/common/Icon';

// 하트 이벤트 (웹 HeartEventPage 포팅).
const events = [
  { key: 'verify', title: '오늘의 루틴 인증하기', path: '/verify' },
  { key: 'follow', title: 'ACC 인스타그램 팔로우', path: '/explore' },
  { key: 'invite', title: '친구 초대하기', path: '/group/invite' },
  { key: 'cheer', title: '친구 응원해주기', path: '/explore' },
];

export default function HeartEventScreen() {
  const router = useRouter();
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <View className="relative flex-row items-center px-7 pt-4">
        <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-primary">
          <Text className="text-lg text-white">‹</Text>
        </Pressable>
        <Text className="absolute left-0 right-0 text-center text-[19px] font-semibold text-ink">하트 이벤트</Text>
      </View>

      <ScrollView className="flex-1 px-7" contentContainerClassName="pb-8 pt-8">
        <View className="flex-row items-start justify-between gap-3">
          <View className="max-w-[220px]">
            <Text className="text-[25px] font-bold text-ink" style={{ lineHeight: 32 }}>하트를 모아{'\n'}다시 도전해요!</Text>
            <Text className="mt-3 text-[10px] font-medium text-subtle">하트 이벤트에 참여하고 하트를 다시 획득할 수 있어요.</Text>
          </View>
          <View className="w-[114px] items-center gap-1 rounded-[7px] border border-line bg-surface py-3">
            <View className="flex-row items-center gap-1.5"><Icon name="heart" size={17} /><Text className="text-[18px] font-bold text-ink">3</Text></View>
            <Text className="text-[12px] font-semibold text-[#d9573b]">보유 하트</Text>
          </View>
        </View>

        <View className="mt-9 gap-4">
          {events.map((e) => (
            <Pressable key={e.key} onPress={() => router.push(e.path)} className="h-[50px] flex-row items-center justify-between rounded-[13px] border border-line bg-white px-4">
              <View className="flex-row items-center gap-3">
                <Icon name="check" size={20} />
                <Text className="text-[13px] font-semibold text-ink">{e.title}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Icon name="heart" size={12} />
                <Text className="text-[12px] font-semibold text-ink">+1</Text>
                <Text className="ml-1 text-[12px] text-disabled">›</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
