import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 이용약관 (웹 TermsPage 포팅).
const sections = [
  { title: '제1조 (목적)', body: '이 약관은 ALLOG(Anti-Lazing Log)가 제공하는 그룹형 루틴 수행 서비스의 이용 조건과 절차, 회원과 서비스의 권리·의무를 규정합니다.' },
  { title: '제2조 (루틴방 이용)', body: '회원은 공개 루틴방에 직접 참가하거나, 친구끼리 참여를 체크해 비공개 루틴방을 만들고 초대링크로 팀원을 초대할 수 있습니다. 모든 루틴방은 방장이 설정한 정원이 충족되면 루틴 수행이 시작됩니다.' },
  { title: '제3조 (하트 시스템)', body: '회원은 온보딩 완료 시 서버가 지급한 하트를 확인할 수 있으며, 그룹 참가 시 하트 1개를 사용합니다. 시작 전에 참가를 취소하거나 그룹이 취소되면 환급은 서버에서 자동 처리됩니다.' },
  { title: '제4조 (인증 및 평가)', body: '회원은 사진·동영상·앱 기록 등 루틴 특성에 맞는 방식으로 인증합니다. AI는 관련성, 제출 시간, 중복 이미지, 이상 징후를 1차 검토하며, 최종 진위 판정과 제재는 AI가 단독으로 결정하지 않습니다.' },
  {
    title: '제5조 (금지행위 및 제재)',
    list: [
      '이전 인증물 재사용 또는 타인 콘텐츠 도용 — 해당 인증 무효, 점수 재산정, 반복 시 참여 제한',
      '루틴과 무관하거나 수행 확인이 어려운 인증 — 추가 검토 후 인증 무효 또는 재인증 요청',
      '부적절한 콘텐츠·커뮤니티 규칙 위반 — 콘텐츠 삭제, 경고, 방 퇴장, 이후 참여 제한',
      '보상 지급 후 부정 확인 — 하트·포인트·쿠폰·체험 혜택 취소 또는 회수',
      '악의적 허위 신고 — 신고자 경고, 신고 기능 또는 활동 제한',
    ],
  },
  { title: '제6조 (그룹 피드와 개인정보)', body: '공개방과 친구방 모두 인증 피드는 해당 방 구성원만 확인할 수 있습니다. 회원의 개인정보는 닉네임, 선택 이미지 등 최소 정보 중심으로 수집하며, 삭제·탈퇴 요청 시 관련 절차를 지원합니다.' },
  { title: '제7조 (의료·건강 정보에 대한 면책)', body: 'ALLOG와 AI 코치는 의료적 진단이나 치료 결정을 내리지 않습니다. 운동·식단·수면 등 루틴 관련 안내는 참고용이며, 의료 전문가의 진단과 상담을 대체하지 않습니다.' },
  { title: '제8조 (약관의 변경)', body: '서비스는 운영상 필요한 경우 관련 법령을 준수하여 이 약관을 개정할 수 있으며, 개정 시 서비스 내 공지사항을 통해 사전 안내합니다.' },
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

export default function Terms() {
  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <Header title="이용약관" />
      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-4 pb-10">
        <Text className="text-[11px] font-medium text-muted">시행일: 2026.08.10</Text>
        <View className="gap-4 rounded-[20px] border border-line bg-surface p-5">
          {sections.map((section) => (
            <View key={section.title}>
              <Text className="text-[13px] font-bold text-ink">{section.title}</Text>
              {section.body && <Text className="mt-1.5 text-[12px] font-medium leading-5 text-[#4a4a4a]">{section.body}</Text>}
              {section.list && (
                <View className="mt-1.5 gap-1">
                  {section.list.map((line) => (
                    <Text key={line} className="text-[11px] font-medium leading-5 text-[#4a4a4a]">· {line}</Text>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
