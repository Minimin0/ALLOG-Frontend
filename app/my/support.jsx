import { useState } from 'react';
import { View, Text, Pressable, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 고객센터 (웹 CustomerSupportPage 포팅).
const faqs = [
  { q: '하트는 어디에 사용하나요?', a: '하트는 그룹 참가에 사용돼요. 현재 하트 획득 이벤트는 준비 중이에요.' },
  { q: '루틴 인증은 어떻게 검토되나요?', a: 'AI가 관련성, 제출 시간, 중복 이미지, 이상 징후를 1차로 검토해요. 최종 진위 판정과 제재는 AI 단독이 아니라 신고와 운영 검토를 함께 거쳐요.' },
  { q: '그룹 참가 하트는 어떻게 되나요?', a: '그룹에 참가할 때 하트 1개를 사용해요. 시작 전에 참가를 취소하거나 그룹이 취소되면 환급은 서버에서 자동 처리돼요.' },
  { q: '친구끼리만 참여하는 방은 어떻게 만드나요?', a: "그룹 만들기 화면 하단의 '친구끼리 참여' 체크박스를 선택하면 비공개 방으로 생성되고, 생성 완료 후 초대링크로 친구를 초대할 수 있어요." },
  { q: '부적절한 인증이나 콘텐츠는 어떻게 신고하나요?', a: '그룹 피드의 인증 게시물에서 신고 기능을 이용할 수 있어요. 신고된 내용은 운영 정책에 따라 검토 후 처리돼요.' },
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

export default function Support() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <Header title="고객센터" />
      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-5 pb-10">
        <View className="rounded-[20px] border border-line bg-surface p-5">
          <Text className="text-[13px] font-bold text-ink">1:1 문의하기</Text>
          <Text className="mt-1 text-[11px] font-medium leading-5 text-muted">평일 10:00 ~ 18:00 (주말·공휴일 휴무){'\n'}보통 영업일 기준 1~2일 이내 답변드려요.</Text>
          <Pressable
            onPress={() => Linking.openURL('mailto:support@allog.app')}
            className="mt-3 h-[44px] items-center justify-center rounded-[13px] bg-primary"
          >
            <Text className="text-[13px] font-bold text-white">support@allog.app 로 문의하기</Text>
          </Pressable>
        </View>

        <View>
          <Text className="mb-2 text-[13px] font-bold text-[#4a4a4a]">자주 묻는 질문</Text>
          <View className="overflow-hidden rounded-[20px] border border-line bg-surface">
            {faqs.map((item, index) => {
              const open = openIndex === index;
              return (
                <View key={item.q} className={index > 0 ? 'border-t border-line' : ''}>
                  <Pressable onPress={() => setOpenIndex(open ? -1 : index)} className="flex-row items-center gap-3 px-5 py-4">
                    <Text className="flex-1 text-[13px] font-bold text-ink">{item.q}</Text>
                    <Text className="text-[12px] text-disabled">{open ? '⌃' : '⌄'}</Text>
                  </Pressable>
                  {open && <Text className="px-5 pb-4 text-[12px] font-medium leading-5 text-muted">{item.a}</Text>}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
