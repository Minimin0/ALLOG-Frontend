import { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Mascot from '@/components/common/Mascot';

// 탐색 화면 (웹 src/pages/explore/ExplorePage.jsx 포팅). 참가/필터 모달은 RN Modal로.
const categories = ['전체', '수분케어', '식사', '운동', '수면'];
const durations = ['전체', '7일', '14일', '30일'];
const statuses = ['전체', '모집중', '정원 충족'];

const aiPick = { id: 'ai-water', title: '매일 물 1.5L 마시기', members: '4/5명', status: '모집중' };
const groups = [
  { id: 'water-evening', title: '저녁형 수분 루틴', members: '3/5명', duration: '14일', full: false, status: '모집중' },
  { id: 'water-morning', title: '아침 물 챌린지', members: '4/5명', duration: '7일', full: false, status: '모집중' },
  { id: 'water-worker', title: '직장인 수분 루틴', members: '5/5명', duration: '30일', full: true, status: '정원 충족' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('수분케어');
  const [joinTarget, setJoinTarget] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [durationFilter, setDurationFilter] = useState('전체');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [appliedDuration, setAppliedDuration] = useState('전체');
  const [appliedStatus, setAppliedStatus] = useState('전체');

  const hasActiveFilter = appliedDuration !== '전체' || appliedStatus !== '전체';
  const filteredGroups = useMemo(
    () =>
      groups.filter(
        (g) =>
          (appliedDuration === '전체' || g.duration === appliedDuration) &&
          (appliedStatus === '전체' || g.status === appliedStatus)
      ),
    [appliedDuration, appliedStatus]
  );

  const openFilter = () => {
    setDurationFilter(appliedDuration);
    setStatusFilter(appliedStatus);
    setFilterOpen(true);
  };
  const applyFilter = () => {
    setAppliedDuration(durationFilter);
    setAppliedStatus(statusFilter);
    setFilterOpen(false);
  };
  const confirmJoin = () => {
    const g = joinTarget;
    setJoinTarget(null);
    router.push({ pathname: '/group/join-complete', params: { groupId: g.id, title: g.title } });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="flex-row items-center justify-between px-[30px] pt-4">
        <Text className="text-[28px] font-bold text-ink">탐색</Text>
        <Pressable
          onPress={() => router.push('/ai')}
          accessibilityLabel="AI 코치"
          className="h-[54px] w-[54px] items-center justify-center overflow-hidden rounded-full bg-primary-tint"
        >
          <Mascot size={44} />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-[30px]" contentContainerClassName="gap-4 pb-8 pt-5">
        {/* 검색 + 필터 */}
        <View className="flex-row items-center gap-2">
          <View className="h-[45px] flex-1 flex-row items-center gap-2 rounded-[14px] border border-line bg-surface px-4">
            <Text>🔍</Text>
            <TextInput
              placeholder="그룹 또는 루틴 검색..."
              placeholderTextColor="#6b7268"
              className="flex-1 text-[14px] text-muted"
            />
          </View>
          <Pressable
            onPress={openFilter}
            className="h-[45px] w-[45px] items-center justify-center rounded-[14px] bg-primary"
          >
            <Text className="text-base">🎚️</Text>
            {hasActiveFilter && <View className="absolute right-[6px] top-[6px] h-[8px] w-[8px] rounded-full bg-[#d9573b]" />}
          </Pressable>
        </View>

        {/* 카테고리 칩 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1.5">
          {categories.map((item) => {
            const active = category === item;
            return (
              <Pressable
                key={item}
                onPress={() => setCategory(item)}
                className={`rounded-[10px] border px-4 py-2.5 ${active ? 'border-primary bg-primary' : 'border-line bg-surface'}`}
              >
                <Text className={`text-[13px] font-semibold ${active ? 'text-surface' : 'text-muted'}`}>{item}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* AI 추천 */}
        <View className="rounded-[18px] border border-line bg-primary-tint p-4">
          <Pressable onPress={() => router.push(`/explore/group/${aiPick.id}`)}>
            <Text className="text-[11px]">
              <Text className="font-bold text-ink">AI 추천 </Text>
              <Text className="font-semibold text-primary">곧 마감돼요, 자리 1개 남았어요</Text>
            </Text>
            <Text className="mt-2 text-[16px] font-bold text-ink">{aiPick.title}</Text>
            <View className="mt-2 flex-row items-center gap-2.5">
              <Text className="text-[12px] font-semibold text-ink">{aiPick.members}</Text>
              <Text className="text-[12px] text-ink"><Text className="text-[#d9573b]">♥</Text> 1개</Text>
              <Text className="text-[12px] font-bold text-ink">{aiPick.status}</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => setJoinTarget(aiPick)}
            className="mt-3 self-end rounded-[12px] bg-primary px-3.5 py-2"
          >
            <Text className="text-[12px] font-bold text-surface">참가</Text>
          </Pressable>
        </View>

        {/* 모집중인 그룹 */}
        <View>
          <Text className="mb-2.5 text-[13px] font-bold text-ink">모집중인 그룹</Text>
          {filteredGroups.length === 0 ? (
            <View className="rounded-[16px] border border-line bg-surface p-4">
              <Text className="text-center text-[13px] text-muted">조건에 맞는 그룹이 없어요.</Text>
            </View>
          ) : (
            <View className="gap-3">
              {filteredGroups.map((group) => (
                <View key={group.id} className="flex-row items-center justify-between rounded-[16px] border border-line bg-surface p-4">
                  <Pressable className="flex-1" onPress={() => router.push(`/explore/group/${group.id}`)}>
                    <Text className={`text-[15px] font-bold ${group.full ? 'text-disabled' : 'text-ink'}`}>{group.title}</Text>
                    <Text className={`mt-1.5 text-[12px] ${group.full ? 'text-disabled' : 'text-muted'}`}>
                      {group.members} <Text className={group.full ? '' : 'text-[#d9573b]'}>♥</Text> 1개 필요
                    </Text>
                  </Pressable>
                  <Pressable
                    disabled={group.full}
                    onPress={() => setJoinTarget(group)}
                    className={`rounded-[12px] px-3.5 py-2 ${group.full ? 'bg-[#f9ddd7] opacity-40' : 'bg-primary-tint'}`}
                  >
                    <Text className={`text-[12px] font-bold ${group.full ? 'text-[#d9573b]' : 'text-[#1f3d2b]'}`}>{group.full ? '마감' : '참가'}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 직접 만들기 */}
        <View className="items-center pt-1">
          <Text className="text-[13px] font-medium text-muted">하고싶은 루틴이 없다면?</Text>
          <Pressable
            onPress={() => router.push('/group/create')}
            className="mt-3 h-[50px] w-full items-center justify-center rounded-[27.5px] bg-primary"
          >
            <Text className="text-[15px] font-bold text-white">직접 그룹 만들기</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* 참가 모달 */}
      <Modal visible={!!joinTarget} transparent animationType="fade" onRequestClose={() => setJoinTarget(null)}>
        <Pressable className="flex-1 items-center justify-center bg-black/40 px-8" onPress={() => setJoinTarget(null)}>
          <Pressable className="w-full rounded-[20px] bg-surface p-6" onPress={() => {}}>
            <Text className="text-center text-[17px] font-bold text-ink">{joinTarget?.title}</Text>
            <Text className="mt-2 text-center text-[13px] text-muted">이 그룹에 참가할까요? (하트 1개 필요)</Text>
            <View className="mt-5 flex-row gap-3">
              <Pressable onPress={() => setJoinTarget(null)} className="flex-1 items-center justify-center rounded-[14px] bg-surface-alt py-3">
                <Text className="text-[14px] font-bold text-ink">취소</Text>
              </Pressable>
              <Pressable onPress={confirmJoin} className="flex-1 items-center justify-center rounded-[14px] bg-primary py-3">
                <Text className="text-[14px] font-bold text-white">참가하기</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 필터 모달 */}
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setFilterOpen(false)}>
          <Pressable className="rounded-t-[24px] bg-surface p-6" onPress={() => {}}>
            <Text className="text-[17px] font-bold text-ink">필터</Text>

            <Text className="mt-4 mb-2 text-[13px] font-bold text-muted">기간</Text>
            <View className="flex-row flex-wrap gap-2">
              {durations.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDurationFilter(d)}
                  className={`rounded-[10px] border px-4 py-2 ${durationFilter === d ? 'border-primary bg-primary' : 'border-line bg-surface'}`}
                >
                  <Text className={`text-[13px] font-semibold ${durationFilter === d ? 'text-surface' : 'text-muted'}`}>{d}</Text>
                </Pressable>
              ))}
            </View>

            <Text className="mt-4 mb-2 text-[13px] font-bold text-muted">모집 상태</Text>
            <View className="flex-row flex-wrap gap-2">
              {statuses.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setStatusFilter(s)}
                  className={`rounded-[10px] border px-4 py-2 ${statusFilter === s ? 'border-primary bg-primary' : 'border-line bg-surface'}`}
                >
                  <Text className={`text-[13px] font-semibold ${statusFilter === s ? 'text-surface' : 'text-muted'}`}>{s}</Text>
                </Pressable>
              ))}
            </View>

            <View className="mt-6 flex-row gap-3">
              <Pressable
                onPress={() => {
                  setDurationFilter('전체');
                  setStatusFilter('전체');
                }}
                className="flex-1 items-center justify-center rounded-[14px] bg-surface-alt py-3"
              >
                <Text className="text-[14px] font-bold text-ink">초기화</Text>
              </Pressable>
              <Pressable onPress={applyFilter} className="flex-1 items-center justify-center rounded-[14px] bg-primary py-3">
                <Text className="text-[14px] font-bold text-white">적용</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
