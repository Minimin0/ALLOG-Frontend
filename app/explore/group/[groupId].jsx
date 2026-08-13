import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';

// 그룹 상세 (웹 explore/GroupDetailPage 포팅). 내부 탭: 인증/랭킹/정보 + 참가 버튼.
const TABS = [
  { key: 'verify', label: '인증' },
  { key: 'ranking', label: '랭킹' },
  { key: 'info', label: '정보' },
];
const members = [
  { name: '민지', isMe: true, done: false },
  { name: '지민', isMe: false, done: false },
  { name: '하민', isMe: false, done: true, time: '2시간 전' },
  { name: '편지', isMe: false, done: true, time: '3시간 전' },
  { name: '해주', isMe: false, done: true, time: '5시간 전' },
];
const rankReward = [
  { rank: 1, name: '민지', reward: '1540P' },
  { rank: 2, name: '지민', reward: '1080P' },
  { rank: 3, name: '하민', reward: '560P' },
];
const podium = [
  { rank: 2, name: '지민', medal: '🥈', h: 90 },
  { rank: 1, name: '민지', medal: '🥇', h: 116 },
  { rank: 3, name: '하민', medal: '🥉', h: 70 },
];
const groupTitle = '하루 운동 30분';

export default function GroupDetailScreen() {
  const router = useRouter();
  const { groupId = 'water-evening' } = useLocalSearchParams();
  const [tab, setTab] = useState('verify');

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      {/* 헤더 */}
      <View className="flex-row items-center gap-3 px-5 py-3">
        <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-full border border-line bg-surface">
          <Text className="text-xl text-ink">‹</Text>
        </Pressable>
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-[18px] font-bold text-ink">{groupTitle}</Text>
            <View className="rounded-full bg-primary-pale px-2 py-0.5"><Text className="text-[11px] font-bold text-primary">DAY 5</Text></View>
          </View>
          <Text className="mt-0.5 text-[11px] font-semibold text-subtle">오늘 2/5명 인증완료</Text>
        </View>
        <Pressable onPress={() => router.push('/group/invite')} className="rounded-full border border-line bg-surface px-3 py-1.5">
          <Text className="text-[11px] font-bold text-subtle">🔗 7XQK92</Text>
        </Pressable>
      </View>

      {/* 탭 */}
      <View className="flex-row border-b border-line px-5">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable key={t.key} onPress={() => setTab(t.key)} className={`flex-1 items-center border-b-2 py-3 ${active ? 'border-ink' : 'border-transparent'}`}>
              <Text className={`text-[14px] font-bold ${active ? 'text-ink' : 'text-disabled'}`}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-4 py-5 pb-28">
        {tab === 'verify' && (
          <View className="flex-row flex-wrap gap-3">
            {members.map((m) => (
              <View key={m.name} style={{ width: '47%', minHeight: 176 }} className="justify-between rounded-[15px] border border-line bg-surface p-3">
                {m.done ? (
                  <>
                    <View className="h-[110px] items-center justify-center rounded-[10px] bg-primary-pale"><Text className="text-[26px]">✅</Text></View>
                    <View className="mt-2 flex-row items-center justify-between">
                      <Text className="text-[12px] font-bold text-ink">{m.isMe ? '나' : m.name}</Text>
                      <Text className="text-[10px] font-medium text-disabled">{m.time}</Text>
                    </View>
                    <Pressable onPress={() => router.push('/group')}><Text className="mt-1 text-[10px] font-semibold text-subtle">댓글, 재인증 요청</Text></Pressable>
                  </>
                ) : (
                  <>
                    <View className="h-[80px] items-center justify-center"><Text className="text-[13px] font-semibold text-subtle">{m.isMe ? '아직 오늘 인증을 안했어요.' : '인증을 기다리는 중이에요.'}</Text></View>
                    <Text className="mt-1 text-center text-[12px] font-bold text-ink">{m.isMe ? '나' : m.name}</Text>
                    <Pressable onPress={() => router.push(m.isMe ? '/verify' : '/group')} className="mt-2 rounded-full bg-primary py-2">
                      <Text className="text-center text-[12px] font-bold text-white">{m.isMe ? '인증하기' : '응원하기'}</Text>
                    </Pressable>
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        {tab === 'ranking' && (
          <View className="gap-4">
            <View className="flex-row items-end justify-center gap-3">
              {podium.map((p) => (
                <View key={p.rank} className="items-center">
                  <Text className="text-[26px]">{p.medal}</Text>
                  <Text className="mt-1 text-[12px] font-bold text-ink">{p.rank}위</Text>
                  <View className="mt-2 w-[70px] rounded-t-[10px] bg-primary-pale" style={{ height: p.h }} />
                  <Text className="mt-1 text-[12px] font-semibold text-subtle">{p.name}</Text>
                </View>
              ))}
            </View>
            <View className="rounded-[15px] border border-line bg-surface p-4">
              <Text className="mb-2 text-[13px] font-bold text-ink">랭킹 보상</Text>
              {rankReward.map((r) => (
                <View key={r.rank} className="flex-row items-center justify-between py-1.5">
                  <Text className="text-[13px] font-semibold text-subtle">{r.rank}위 {r.name}</Text>
                  <Text className="text-[13px] font-bold text-ink">🪙 {r.reward}</Text>
                </View>
              ))}
            </View>
            <Pressable onPress={() => router.push('/ranking')} className="items-center rounded-[15px] border border-line bg-surface py-3">
              <Text className="text-[13px] font-bold text-ink">전체 랭킹 보기</Text>
            </Pressable>
          </View>
        )}

        {tab === 'info' && (
          <View className="gap-4">
            <View className="rounded-[15px] border border-line bg-surface p-4">
              {[['그룹명', groupTitle], ['기간', '8.10 ~ 8.24 (14일)'], ['현재 인원', '5명']].map(([l, v], i) => (
                <View key={l} className={`flex-row items-center justify-between py-2.5 ${i < 2 ? 'border-b border-line' : ''}`}>
                  <Text className="text-[13px] font-semibold text-subtle">{l}</Text>
                  <Text className="text-[13px] font-bold text-ink">{v}</Text>
                </View>
              ))}
            </View>
            <View className="flex-row justify-between rounded-[15px] border border-line bg-surface p-4">
              {members.map((m) => (
                <View key={m.name} className="items-center gap-1">
                  <View className="h-[38px] w-[38px] items-center justify-center rounded-full bg-primary-pale"><Text className="text-[13px] font-bold text-primary">{m.name[0]}</Text></View>
                  <Text className="text-[10px] font-semibold text-subtle">{m.isMe ? '나' : m.name}</Text>
                </View>
              ))}
            </View>
            <View className="rounded-[15px] border border-line bg-surface p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-[13px] font-semibold text-subtle">우리 그룹 공동 성공률</Text>
                <Text className="text-[16px] font-bold text-ink">60%</Text>
              </View>
              <View className="mt-3 h-[9px] w-full rounded-full bg-[#f0eee8]">
                <View className="h-full rounded-full bg-primary" style={{ width: '60%' }} />
                <View className="absolute h-[17px] w-0.5 bg-[#d9573b]" style={{ top: -4, left: '80%' }} />
              </View>
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="text-[11px] font-semibold text-subtle">2/5명 완료</Text>
                <Text className="text-[11px] font-semibold text-[#d9573b]">그룹 목표 80%</Text>
              </View>
            </View>
            <View className="flex-row rounded-[15px] border border-line bg-surface py-4">
              <View className="flex-1 items-center border-r border-line">
                <Text className="text-[13px] font-semibold text-subtle">남은 기간</Text>
                <Text className="mt-1 text-[15px] font-bold text-ink">D-2</Text>
              </View>
              <View className="flex-1 items-center">
                <Text className="text-[13px] font-semibold text-subtle">내 순위</Text>
                <Text className="mt-1 text-[15px] font-bold text-ink">1위</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 참가 버튼 (하단 고정) */}
      <View className="border-t border-line bg-surface px-5 py-4">
        <Pressable
          onPress={() => router.push({ pathname: '/group/join-complete', params: { groupId, title: groupTitle } })}
          className="items-center justify-center rounded-[27.5px] bg-primary py-4"
        >
          <Text className="text-[15px] font-bold text-white">그룹 참가하기 (❤️ 1개 사용)</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
