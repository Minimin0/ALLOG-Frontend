import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

import RankingItemRN from '@/components/group/RankingItemRN';
import { mockFullRanking } from '@/data/mockGroups.js';
import { rankMembers } from '@/utils/ranking.js';

// 전체(방 간 통합) 랭킹 (웹 FullRankingPage 포팅). 그룹 상세 "전체 랭킹 보기"에서 진입.
export default function FullRankingScreen() {
  const router = useRouter();
  const ranked = rankMembers(mockFullRanking);

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="relative h-14 flex-row items-center justify-center px-5">
        <Pressable onPress={() => router.back()} className="absolute left-5 h-11 w-11 items-center justify-center rounded-2xl bg-ink">
          <Text className="text-lg text-white">‹</Text>
        </Pressable>
        <Text className="text-[20px] font-bold text-ink">전체 랭킹</Text>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-2.5 pb-8 pt-2">
        {ranked.map((m, i) => (
          <Animated.View key={m.id} entering={FadeInUp.delay(i * 70).duration(320)}>
            <RankingItemRN rank={m.rank} name={m.name} caption={m.group} isMe={m.isMe} score={m.score} />
          </Animated.View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
