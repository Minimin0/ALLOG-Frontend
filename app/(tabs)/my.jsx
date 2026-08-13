import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// 마이 페이지 (웹 src/pages/my/MyPage.jsx 포팅). TODO: 아이콘 실제 에셋 교체(현재 이모지).
const records = [
  { label: '운동', count: '3회', emoji: '🏃' },
  { label: '수면', count: '5회', emoji: '😴' },
  { label: '식사', count: '4회', emoji: '🍽️' },
  { label: '셀프케어', count: '1회', emoji: '🧴' },
];
const menuItems = [
  { label: '알림 설정', emoji: '🔔', path: '/my/notifications' },
  { label: '개인정보 보호', emoji: '🔒', path: '/my/privacy' },
  { label: '이용약관', emoji: '📄', path: '/my/terms' },
  { label: '고객센터', emoji: '💬', path: '/my/support' },
];

export default function MyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-bg">
      <View className="px-[30px] pt-4">
        <Text className="text-[28px] font-bold text-ink">마이 페이지</Text>
      </View>

      <ScrollView className="flex-1 px-[30px]" contentContainerClassName="gap-5 pb-8 pt-4">
        {/* 프로필 카드 */}
        <View className="rounded-[26px] border border-line bg-surface p-5">
          <View className="flex-row items-center gap-4">
            <View className="h-[56px] w-[56px] items-center justify-center rounded-full bg-primary">
              <Text className="text-[20px] font-bold text-white">A</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[18px] font-bold text-ink">민지</Text>
              <Text className="mt-0.5 text-[12px] font-medium text-muted">minzi@gmail.com</Text>
            </View>
            <Pressable
              onPress={() => router.push('/my/edit-profile')}
              className="rounded-full bg-[#e5f4e8] px-4 py-2"
            >
              <Text className="text-[12px] font-bold text-ink">편집</Text>
            </Pressable>
          </View>

          <View className="my-4 h-px bg-line" />

          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-semibold text-[#d9573b]">하트</Text>
              <Text className="mt-1 text-[15px] font-bold text-ink">❤️ 3</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-semibold text-muted">리워드</Text>
              <Text className="mt-1 text-[15px] font-bold text-ink">🪙 1540</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-semibold text-muted">성공한 루틴</Text>
              <Text className="mt-1 text-[15px] font-bold text-ink">✅ 13회</Text>
            </View>
          </View>
        </View>

        {/* 내 기록 */}
        <View>
          <Text className="mb-2.5 text-[13px] font-bold text-muted">내 기록</Text>
          <View className="flex-row justify-between rounded-[26px] border border-line bg-surface p-4">
            {records.map((record) => (
              <View key={record.label} className="items-center">
                <View className="h-[54px] w-[54px] items-center justify-center rounded-full bg-[#f3efe4]">
                  <Text className="text-2xl">{record.emoji}</Text>
                </View>
                <Text className="mt-2 text-[11px] font-semibold text-ink">{record.label}</Text>
                <Text className="mt-0.5 text-[15px] font-bold text-primary">{record.count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 메뉴 */}
        <View className="overflow-hidden rounded-[20px] border border-line bg-surface">
          {menuItems.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.path)}
              className={`flex-row items-center gap-3 px-5 py-4 ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <Text className="text-base">{item.emoji}</Text>
              <Text className="flex-1 text-[13px] font-medium text-ink">{item.label}</Text>
              <Text className="text-[14px] text-disabled">›</Text>
            </Pressable>
          ))}
        </View>

        {/* 로그아웃 */}
        <Pressable className="h-[50px] items-center justify-center rounded-[13px] border border-[#d9573b] bg-surface">
          <Text className="text-[15px] font-bold text-[#d9573b]">로그아웃</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
