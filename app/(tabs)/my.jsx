import { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';

import Icon from '@/components/common/Icon';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

// 마이 페이지. 하트/리워드/성공한 루틴은 GET /users/me/stats, 닉네임과 관심 루틴은
// GET /users/me에서 온다. 루틴별 인증 횟수 API는 없으므로 관심 루틴을 대신 보여준다.
const INTEREST_META = {
  hydration: { label: '수분케어', icon: 'selfcare' },
  exercise: { label: '운동', icon: 'exercise' },
  meal: { label: '식사', icon: 'meal' },
  sleep: { label: '수면', icon: 'sleep' },
  skincare: { label: '피부관리', icon: 'selfcare' },
};
const menuItems = [
  { label: '알림 설정', icon: 'bell', path: '/my/notifications' },
  { label: '개인정보 보호', icon: 'privacy', path: '/my/privacy' },
  { label: '이용약관', icon: 'terms', path: '/my/terms' },
  { label: '고객센터', icon: 'support', path: '/my/support' },
];

export default function MyScreen() {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const profile = useUserStore((s) => s.profile);
  const stats = useUserStore((s) => s.stats);

  useFocusEffect(
    useCallback(() => {
      useUserStore.getState().loadStats();
    }, []),
  );

  const interests = (profile?.onboarding?.interestRoutines ?? [])
    .map((key) => INTEREST_META[key])
    .filter(Boolean);

  const confirmLogout = async () => {
    setLogoutError('');
    if (!await useAuthStore.getState().signOut()) {
      setLogoutError('로그아웃하지 못했어요. 다시 시도해 주세요.');
      return;
    }
    setLogoutOpen(false);
    router.replace('/');
  };

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
              <Text className="text-[20px] font-bold text-white">{profile?.nickname?.[0] ?? 'A'}</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[18px] font-bold text-ink">{profile?.nickname ?? '–'}</Text>
            </View>
            <Pressable
              onPress={() => router.push('/my/edit-profile')}
              className="rounded-full bg-mint-badge px-4 py-2"
            >
              <Text className="text-[12px] font-bold text-ink">편집</Text>
            </Pressable>
          </View>

          <View className="my-4 h-px bg-line" />

          <View className="flex-row">
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-semibold text-heart">하트</Text>
              <View className="mt-1 flex-row items-center gap-1"><Icon name="heart" size={13} /><Text className="text-[15px] font-bold text-ink">{stats?.hearts ?? '–'}</Text></View>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-semibold text-muted">리워드</Text>
              <View className="mt-1 flex-row items-center gap-1"><Icon name="coin" size={13} /><Text className="text-[15px] font-bold text-ink">{stats?.rewardPoints ?? '–'}</Text></View>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-[10px] font-semibold text-muted">성공한 루틴</Text>
              <View className="mt-1 flex-row items-center gap-1"><Icon name="check" size={13} /><Text className="text-[15px] font-bold text-ink">{stats?.successfulRoutines ?? 0}회</Text></View>
            </View>
          </View>
        </View>

        {/* 관심 루틴 (온보딩에서 고른 값) */}
        {interests.length > 0 && (
          <View>
            <Text className="mb-2.5 text-[13px] font-bold text-muted">관심 루틴</Text>
            <View className="flex-row justify-between rounded-[26px] border border-line bg-surface p-4">
              {interests.map((item) => (
                <View key={item.label} className="items-center">
                  <View className="h-[54px] w-[54px] items-center justify-center rounded-full bg-beige-icon">
                    <Icon name={item.icon} size={24} />
                  </View>
                  <Text className="mt-2 text-[11px] font-semibold text-ink">{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 메뉴 */}
        <View className="overflow-hidden rounded-[20px] border border-line bg-surface">
          {menuItems.map((item, i) => (
            <Pressable
              key={item.label}
              onPress={() => router.push(item.path)}
              className={`flex-row items-center gap-3 px-5 py-4 ${i > 0 ? 'border-t border-line' : ''}`}
            >
              <Icon name={item.icon} size={18} />
              <Text className="flex-1 text-[13px] font-medium text-ink">{item.label}</Text>
              <Text className="text-[14px] text-disabled">›</Text>
            </Pressable>
          ))}
        </View>

        {/* 로그아웃 */}
        <Pressable onPress={() => { setLogoutError(''); setLogoutOpen(true); }} className="h-[50px] items-center justify-center rounded-[13px] border border-heart bg-surface">
          <Text className="text-[15px] font-bold text-heart">로그아웃</Text>
        </Pressable>
      </ScrollView>

      {/* 로그아웃 확인 바텀시트 — 반투명 배경 + 아래에서 위로 */}
      <Modal visible={logoutOpen} transparent animationType="slide" onRequestClose={() => setLogoutOpen(false)}>
        <Pressable className="flex-1 justify-end bg-black/40" onPress={() => setLogoutOpen(false)}>
          <Pressable className="rounded-t-[24px] bg-surface px-6 pb-8 pt-6" onPress={() => {}}>
            <Text className="text-center text-[17px] font-bold text-ink">정말 로그아웃 하시겠어요?</Text>
            {logoutError ? <Text className="mt-2 text-center text-[12px] font-semibold text-heart">{logoutError}</Text> : null}
            <View className="mt-6 flex-row gap-3">
              <Pressable onPress={() => setLogoutOpen(false)} className="flex-1 items-center justify-center rounded-[14px] border border-line bg-surface py-3.5">
                <Text className="text-[14px] font-bold text-ink">아니오</Text>
              </Pressable>
              <Pressable onPress={confirmLogout} className="flex-1 items-center justify-center rounded-[14px] bg-heart py-3.5">
                <Text className="text-[14px] font-bold text-white">네</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
