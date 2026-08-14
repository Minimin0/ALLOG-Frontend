import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import Toggle from '@/components/common/Toggle';

// 알림 설정 (웹 NotificationSettingsPage 포팅).
const initialSettings = [
  { key: 'routine', label: '루틴 인증 알림', desc: '마감 임박, 인증 리마인드', value: true },
  { key: 'group', label: '그룹 활동 알림', desc: '응원, 댓글, 새 멤버 참가', value: true },
  { key: 'goal', label: '공동 목표 달성 알림', desc: '그룹 공동 목표 달성 시 알림', value: true },
  { key: 'reward', label: '리워드 · 이벤트 알림', desc: '하트 이벤트, 신규 리워드 소식', value: true },
  { key: 'marketing', label: '마케팅 알림', desc: 'AAC 혜택 및 프로모션 소식', value: false },
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

export default function Notifications() {
  const [settings, setSettings] = useState(initialSettings);
  const updateSetting = (key, value) =>
    setSettings((prev) => prev.map((item) => (item.key === key ? { ...item, value } : item)));

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
      <Header title="알림 설정" />
      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-3 pb-10">
        <View className="overflow-hidden rounded-[20px] border border-line bg-surface">
          {settings.map((item, i) => (
            <View key={item.key} className={`flex-row items-center gap-3 px-5 py-4 ${i > 0 ? 'border-t border-line' : ''}`}>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-ink">{item.label}</Text>
                <Text className="mt-0.5 text-[11px] font-medium text-muted">{item.desc}</Text>
              </View>
              <Toggle checked={item.value} onChange={(next) => updateSetting(item.key, next)} label={item.label} />
            </View>
          ))}
        </View>
        <Text className="px-1 text-[11px] font-medium leading-5 text-muted">
          루틴 인증 알림을 꺼두면 마감 임박 리마인드를 받지 못해 완주율에 영향을 줄 수 있어요.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
