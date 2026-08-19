import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import Animated, { FadeInUp, FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

import CoachMascotButton from '../../mobile/src/components/CoachMascotButton';
import { useAppState } from '../../mobile/src/state/AppState';
import { getCoachImage } from '../../mobile/src/utils/coach';
import Icon from '@/components/common/Icon';
import AnimatedGauge from '@/components/common/AnimatedGauge';
import CheerOverlay from '@/components/group/CheerOverlay';
import ReverifyRequestSheet from '@/components/group/ReverifyRequestSheet';
import RankingItemRN from '@/components/group/RankingItemRN';

const WORKOUT = require('../../assets/images/workout-verify.png');
import { mockGroup, mockGroupRanking, mockFeed } from '@/data/mockGroups.js';
import { rankMembers } from '@/utils/ranking.js';
import { calcScore, rewardFromScore } from '@/utils/score.js';

const TABS = [
  { key: 'feed', label: '인증' },
  { key: 'ranking', label: '랭킹' },
  { key: 'info', label: '정보' },
];

// 클립 아이콘 (SVG — 이모지는 기기별 폰트 미지원 시 깨진 도형으로 보일 수 있어 벡터로 대체).
function ClipIcon({ size = 14, color = '#111111' }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </Svg>
  );
}

// ── 랭킹 탭 ──
function RankingView() {
  const router = useRouter();
  const ranked = rankMembers(mockGroupRanking.map((m) => ({ ...m, score: m.minutes })));
  return (
    <View className="gap-2.5 p-5">
      {ranked.map((m, i) => (
        <Animated.View key={m.id} entering={FadeInUp.delay(i * 70).duration(320)}>
          <RankingItemRN rank={m.rank} name={m.name} caption={`누적 운동 시간 ${m.score}분`} isMe={m.isMe} />
        </Animated.View>
      ))}
      <Pressable onPress={() => router.push('/ranking')} className="items-center rounded-item border border-line bg-surface py-3">
        <Text className="text-[13px] font-bold text-ink">전체 랭킹 보기</Text>
      </Pressable>
    </View>
  );
}

// ── 인증(피드) 탭 ──
function FeedCard({ item, onVerify, onCheer, onReport }) {
  if (item.status === 'verified') {
    return (
      <View style={{ width: '47%', aspectRatio: 3 / 4 }} className="overflow-hidden rounded-card bg-ink">
        {/* 사용자가 업로드한 인증 영상 화면 */}
        <Image source={WORKOUT} resizeMode="cover" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
        {/* 우측 상단 점3개 → 재인증 요청 */}
        <Pressable onPress={onReport} hitSlop={8} className="absolute right-1 top-0 h-8 w-8 items-center justify-center">
          <Text className="text-xl font-bold text-white">⋯</Text>
        </Pressable>
        <View className="absolute bottom-2 left-2 flex-row items-center gap-1.5">
          <View className="h-6 w-6 items-center justify-center rounded-full bg-surface">
            <Text className="text-[10px] font-semibold text-ink">{item.name[0]}</Text>
          </View>
          <View>
            <Text className="text-[11px] font-semibold text-white">{item.name}</Text>
            <Text className="text-[10px] text-white/80">{item.timeAgo}</Text>
          </View>
        </View>
      </View>
    );
  }
  const isMe = item.status === 'me';
  return (
    <View style={{ width: '47%', aspectRatio: 3 / 4 }} className={`rounded-card border border-line p-4 ${isMe ? 'bg-primary-tint' : 'bg-surface'}`}>
      <Text className="text-[15px] font-bold text-ink">{isMe ? '아직 오늘\n인증을 안했어요.' : '인증을\n기다리는 중이에요.'}</Text>
      <View className="flex-1 items-center justify-center">
        <Pressable onPress={isMe ? onVerify : onCheer} className="rounded-pill bg-ink px-5 py-2">
          <Text className="text-[11px] font-bold text-white">{isMe ? '인증하기' : '응원하기'}</Text>
        </Pressable>
      </View>
      <View className="flex-row items-center gap-1.5">
        <View className="h-6 w-6 items-center justify-center rounded-full bg-ink">
          <Text className="text-[10px] font-semibold text-white">{isMe ? '나' : item.name[0]}</Text>
        </View>
        <Text className="text-[11px] text-ink">{isMe ? '나' : item.name}</Text>
      </View>
    </View>
  );
}

function FeedView({ toast, cheer }) {
  const router = useRouter();
  const [reportTarget, setReportTarget] = useState(null);
  // 2열 그리드: 2개씩 묶어 행으로
  const rows = [];
  for (let i = 0; i < mockFeed.length; i += 2) rows.push(mockFeed.slice(i, i + 2));
  return (
    <View className="gap-3 p-5">
      {rows.map((row, ri) => (
        <View key={ri} className="flex-row justify-between">
          {row.map((item) => (
            <FeedCard
              key={item.id}
              item={item}
              onVerify={() => router.push('/verify')}
              onCheer={cheer}
              onReport={() => setReportTarget(item.name)}
            />
          ))}
          {row.length === 1 && <View style={{ width: '47%' }} />}
        </View>
      ))}

      <ReverifyRequestSheet
        open={reportTarget !== null}
        targetName={reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={() => {
          setReportTarget(null);
          toast('재인증 요청이 전송되었어요!');
        }}
      />
    </View>
  );
}

// ── 정보 탭 ──
function InfoRow({ label, value }) {
  return (
    <View className="flex-row items-center justify-between border-b border-line py-3">
      <Text className="text-[15px] text-muted">{label}</Text>
      <Text className="text-[15px] font-semibold text-ink">{value}</Text>
    </View>
  );
}

function Podium({ items }) {
  const H = { 1: 120, 2: 92, 3: 62 };
  const order = [2, 1, 3]; // 은-금-동 배치
  const medal = { 1: '🥇', 2: '🥈', 3: '🥉' };
  // 순위별 바 색(금/은/동) — 메달 색과 맞춰 한눈에 구분되도록.
  const BAR_BG = { 1: '#fbe6ab', 2: '#e6e6e6', 3: '#ecd2ac' };
  return (
    <View className="mt-2 flex-row items-end justify-center gap-3">
      {order.map((rank) => {
        const it = items.find((x) => x.rank === rank);
        if (!it) return <View key={rank} className="w-20" />;
        return (
          <View key={rank} className="w-20 items-center">
            <Text className="text-2xl">{medal[rank]}</Text>
            <Text className="text-[12px] font-bold text-ink">{it.name}</Text>
            <View className="mb-1 flex-row items-center gap-1">
              <Icon name="coin" size={11} />
              <Text className="text-[11px] font-semibold text-reward">{it.reward}</Text>
            </View>
            <View className="w-full rounded-t-xl" style={{ height: H[rank], backgroundColor: BAR_BG[rank] }} />
          </View>
        );
      })}
    </View>
  );
}

function InfoView({ toast }) {
  const [membersOpen, setMembersOpen] = useState(false);
  const scored = mockGroupRanking.map((m) => ({ ...m, score: calcScore(m.breakdown).total }));
  const ranked = rankMembers(scored);
  const top3 = ranked.filter((m) => m.rank <= 3);
  const me = ranked.find((m) => m.isMe);

  return (
    <View className="gap-6 p-5">
      <View>
        <InfoRow label="그룹명" value={mockGroup.title} />
        <InfoRow label="기간" value={mockGroup.periodText} />
        <Pressable
          onPress={() => setMembersOpen((o) => !o)}
          className="flex-row items-center justify-between border-b border-line py-3"
        >
          <Text className="text-[15px] text-muted">현재 인원</Text>
          <Text className="text-[15px] font-semibold text-ink">{mockGroup.totalMembers} 명 {membersOpen ? '⌄' : '›'}</Text>
        </Pressable>
        {membersOpen && (
          <Animated.View
            entering={FadeIn.duration(240)}
            exiting={FadeOut.duration(180)}
            className="flex-row flex-wrap gap-3 border-b border-line py-4"
          >
            {ranked.map((m) => (
              <View key={m.id} className="w-12 items-center gap-1">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-ink">
                  <Text className="text-[12px] font-bold text-white">{m.name[0]}</Text>
                </View>
                <Text className="text-[10px] text-ink">{m.isMe ? '나' : m.name}</Text>
              </View>
            ))}
          </Animated.View>
        )}
        <Animated.View layout={LinearTransition.duration(240)}>
          <Pressable onPress={() => toast('복사 되었어요! 🌱')} className="flex-row items-center justify-between border-b border-line py-3">
            <Text className="text-[15px] text-muted">초대 코드</Text>
            <View className="flex-row items-center gap-1.5">
              <ClipIcon size={14} color="#111111" />
              <Text className="text-[15px] font-semibold text-ink">{mockGroup.inviteCode}</Text>
            </View>
          </Pressable>
        </Animated.View>
      </View>

      <View className="rounded-item border border-line bg-surface p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[11px] font-semibold text-ink">우리 그룹 공동 성공률</Text>
          <Text className="text-[25px] font-bold text-primary">{mockGroup.successRate}%</Text>
        </View>
        <View className="mt-2 h-2 w-full rounded-pill bg-disabled">
          <AnimatedGauge percent={mockGroup.successRate} color="#14453a" height={8} />
          <View className="absolute -top-1 h-4 w-0.5 bg-reward" style={{ left: `${mockGroup.goalRate}%` }} />
        </View>
        <View className="mt-1 flex-row justify-between">
          <Text className="text-[11px] text-muted">{mockGroup.verifiedToday}/{mockGroup.totalMembers}명 완료</Text>
          <Text className="text-[11px] text-reward">그룹 목표 {mockGroup.goalRate}%</Text>
        </View>
      </View>

      <View className="flex-row rounded-item border border-line bg-surface py-4">
        <View className="flex-1 items-center border-r border-line">
          <Text className="text-[12px] font-bold text-ink">남은 기간</Text>
          <Text className="mt-1 text-[30px] font-bold text-primary">D-{mockGroup.dday}</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-[12px] font-bold text-ink">내 순위</Text>
          <Text className="mt-1 text-[30px] font-bold text-primary">{me?.rank}위</Text>
        </View>
      </View>

      <Podium items={top3.map((m) => ({ rank: m.rank, name: m.name, reward: rewardFromScore(m.score) }))} />
    </View>
  );
}

// ── 내 그룹 (메인) ──
export default function GroupScreen() {
  const router = useRouter();
  const { coachStyle } = useAppState();
  const [tab, setTab] = useState('feed');
  const [toastMsg, setToastMsg] = useState('');
  const [cheerKey, setCheerKey] = useState(0);
  const [cheerOn, setCheerOn] = useState(false);
  const [cheerCount, setCheerCount] = useState(0);

  const toast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2000);
  };

  const cheer = () => {
    setCheerCount((c) => (c % 3) + 1); // 1→2→3→1 (하트 캐릭터가 하나씩 플레인으로)
    setCheerKey((k) => k + 1);
    setCheerOn(true);
    setTimeout(() => setCheerOn(false), 1900);
  };

  return (
    <View className="flex-1 bg-bg">
      {/* 헤더 (탐색 탭과 동일한 px-[30px] pt-4 — 탭 레이아웃이 이미 SafeAreaView를 제공하므로 여기서 중복으로 감싸지 않음) */}
      <View className="flex-row items-center justify-between px-[30px] pt-4">
        <Text className="text-[28px] font-black text-ink">내 그룹</Text>
        {tab !== 'info' ? (
          <CoachMascotButton
            source={getCoachImage(coachStyle)}
            onPress={() => router.push(`/ai?from=${tab === 'feed' ? 'feed' : 'ranking'}`)}
          />
        ) : (
          <View style={{ width: 54, height: 54 }} />
        )}
      </View>

      {/* 요약 카드 */}
      <View className="px-[30px] pt-3">
        <View className="rounded-card border border-line bg-primary-tint p-4">
          <Text className="text-[12px] font-bold text-ink">DAY {mockGroup.day}</Text>
          <Text className="text-[22px] font-bold text-ink">{mockGroup.title}</Text>
          <Text className="mt-1 text-[11px] text-muted">오늘 {mockGroup.verifiedToday}/{mockGroup.totalMembers}명 인증완료</Text>
          <View className="mt-3 flex-row gap-2">
            {Array.from({ length: mockGroup.totalMembers }).map((_, i) => (
              <View key={i} className={`h-8 w-8 rounded-full ${i < mockGroup.verifiedToday ? 'bg-primary' : 'bg-surface-alt'}`} />
            ))}
          </View>
        </View>
      </View>

      {/* 세그먼트 탭 */}
      <View className="mt-4 flex-row border-b border-line px-[30px]">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable key={t.key} onPress={() => setTab(t.key)} className={`flex-1 items-center border-b-2 pb-2 ${active ? 'border-ink' : 'border-transparent'}`}>
              <Text className={`text-[17px] font-semibold ${active ? 'text-ink' : 'text-muted'}`}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* 선택된 뷰 */}
      <ScrollView className="flex-1" contentContainerClassName="pb-6">
        {tab === 'feed' && <FeedView toast={toast} cheer={cheer} />}
        {tab === 'ranking' && <RankingView />}
        {tab === 'info' && <InfoView toast={toast} />}
      </ScrollView>

      {/* 응원 오버레이 (캐릭터 3개, 응원할수록 하트→플레인) */}
      {cheerOn && <CheerOverlay key={cheerKey} usedCount={cheerCount} />}

      {/* 토스트 (화면 정중앙, 부드럽게 페이드 인/아웃) */}
      {!!toastMsg && (
        <View pointerEvents="none" className="absolute inset-0 items-center justify-center">
          <Animated.View
            entering={FadeIn.duration(220)}
            exiting={FadeOut.duration(320)}
            className="rounded-pill bg-surface px-6 py-3 shadow"
            style={{ borderWidth: 1, borderColor: '#e7e3d8' }}
          >
            <Text className="text-[15px] font-semibold text-primary">{toastMsg}</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}
