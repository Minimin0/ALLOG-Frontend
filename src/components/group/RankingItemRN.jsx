import { View, Text, StyleSheet } from 'react-native';

// 랭킹 한 줄 (웹 RankingItem 포팅). 1·2·3위 메달 + 테두리, 그 외 숫자.
// score를 주면(전체 랭킹) 우측에 점수를 표시한다.
const TIER = {
  1: { medal: '🥇', border: '#f6b424' },
  2: { medal: '🥈', border: '#bababa' },
  3: { medal: '🥉', border: '#cba04d' },
};

export default function RankingItemRN({ rank, name, caption, isMe = false, score }) {
  const tier = TIER[rank];

  return (
    <View
      className="flex-row items-center gap-3 rounded-item bg-surface px-4 py-3"
      style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: tier ? tier.border : '#e7e3d8' }}
    >
      <View className="w-7 items-center">
        {tier ? (
          <Text className="text-2xl">{tier.medal}</Text>
        ) : (
          <Text className="text-[17px] font-semibold text-ink">{rank}</Text>
        )}
      </View>

      <View className="h-9 w-9 rounded-full bg-surface-alt" />

      <View className="min-w-0 flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-[15px] font-semibold text-ink" numberOfLines={1}>{name}</Text>
          {isMe && (
            <View className="rounded-full bg-primary px-1.5 py-0.5">
              <Text className="text-[10px] font-bold text-white">나</Text>
            </View>
          )}
        </View>
        {caption ? <Text className="text-[11px] text-muted">{caption}</Text> : null}
      </View>

      {score != null && <Text className="text-[15px] font-bold text-ink">{score}점</Text>}
    </View>
  );
}
