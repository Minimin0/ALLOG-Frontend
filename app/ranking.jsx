import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import RankingItemRN from '@/components/group/RankingItemRN';

// 전체(방 간 통합) 랭킹. 랭킹 API가 아직 없어 가짜 순위를 만들지 않는다 —
// 엔드포인트가 생기면 여기서 받아 ranked에 넣으면 화면은 그대로 동작한다.
export default function FullRankingScreen() {
  const router = useRouter();
  const ranked = [];

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="relative h-14 flex-row items-center justify-center px-5">
        <Pressable onPress={() => router.back()} className="absolute left-5 h-11 w-11 items-center justify-center rounded-2xl bg-ink">
          <Text className="text-lg text-white">‹</Text>
        </Pressable>
        <Text className="text-[20px] font-bold text-ink">전체 랭킹</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-2.5 pb-8 pt-2">
        {ranked.length === 0 ? (
          <View className="items-center gap-2 py-16">
            <Text className="text-[15px] font-bold text-ink">랭킹은 아직 준비 중이에요</Text>
            <Text className="text-center text-[13px] text-muted">그룹 공동 진행률은 내 그룹 정보 탭에서 볼 수 있어요.</Text>
          </View>
        ) : (
          ranked.map((m, i) => (
            <Animated.View key={m.id} entering={FadeInUp.delay(i * 70).duration(320)}>
              <RankingItemRN rank={m.rank} name={m.name} caption={m.group} isMe={m.isMe} score={m.score} />
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
