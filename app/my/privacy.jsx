import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Toggle from '@/components/common/Toggle';

// 개인정보 보호 (웹 PrivacyPage 포팅).
const minimizationRows = [
  { title: '프로필', desc: '닉네임, 선택 이미지 등 최소 정보 중심으로만 저장해요.' },
  { title: '온보딩 정보', desc: '루틴방 추천에 필요한 기본 생활 패턴·습관·기간만 수집해요.' },
  { title: '인증 콘텐츠', desc: '루틴 수행 확인에 필요한 범위만 촬영하도록 안내해요.' },
  { title: '그룹 피드', desc: '내가 속한 방의 구성원만 내 인증 기록을 볼 수 있어요.' },
  { title: '보관 정책', desc: '수집 목적과 보관 기간을 명시하고, 삭제·탈퇴 요청을 지원해요.' },
];

function Header({ title }) {
  const router = useRouter();
  return (
    <View className="flex-row items-center gap-3 px-5 py-3">
      <Pressable onPress={() => router.back()} className="h-[43px] w-[43px] items-center justify-center rounded-full border border-line bg-surface">
        <Text className="text-[20px] text-ink">‹</Text>
      </Pressable>
      <Text className="text-[19px] font-bold text-ink">{title}</Text>
    </View>
  );
}

function ToggleRow({ title, desc, value, onChange }) {
  return (
    <View className="flex-row items-center gap-3 px-5 py-4">
      <View className="flex-1">
        <Text className="text-[14px] font-bold text-ink">{title}</Text>
        <Text className="mt-0.5 text-[11px] font-medium text-muted">{desc}</Text>
      </View>
      <Toggle checked={value} onChange={onChange} label={title} />
    </View>
  );
}

export default function Privacy() {
  const [profilePublic, setProfilePublic] = useState(true);
  const [rankingPublic, setRankingPublic] = useState(true);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <Header title="개인정보 보호" />
      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-5 pb-10">
        <View>
          <Text className="mb-2 text-[13px] font-bold text-[#4a4a4a]">공개 범위</Text>
          <View className="overflow-hidden rounded-[20px] border border-line bg-surface">
            <ToggleRow title="프로필 공개" desc="다른 사용자가 내 닉네임과 참여 기록을 볼 수 있어요." value={profilePublic} onChange={setProfilePublic} />
            <View className="border-t border-line" />
            <ToggleRow title="개인 순위 공개" desc="같은 방 구성원에게 내 순위와 달성률을 보여줘요." value={rankingPublic} onChange={setRankingPublic} />
          </View>
        </View>

        <View>
          <Text className="mb-2 text-[13px] font-bold text-[#4a4a4a]">개인정보 최소화 원칙</Text>
          <View className="overflow-hidden rounded-[20px] border border-line bg-surface">
            {minimizationRows.map((row, i) => (
              <View key={row.title} className={`px-5 py-4 ${i > 0 ? 'border-t border-line' : ''}`}>
                <Text className="text-[13px] font-bold text-ink">{row.title}</Text>
                <Text className="mt-1 text-[11px] font-medium leading-5 text-muted">{row.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="gap-2">
          <Pressable className="h-[48px] items-center justify-center rounded-[15px] border border-line bg-surface">
            <Text className="text-[13px] font-bold text-ink">내 데이터 다운로드 요청</Text>
          </Pressable>
          <Pressable className="h-[48px] items-center justify-center rounded-[15px] border border-[#d9573b] bg-surface">
            <Text className="text-[13px] font-bold text-[#d9573b]">계정 삭제 요청</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
