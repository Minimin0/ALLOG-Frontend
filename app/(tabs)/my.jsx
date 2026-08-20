import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

import Icon from '@/components/common/Icon';
import AnimatedEntrance from '../../mobile/src/components/AnimatedEntrance';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';

// 마이 페이지. 하트/리워드/성공한 루틴은 GET /users/me/stats, 닉네임과 관심 루틴은
// GET /users/me에서 온다. 루틴별 인증 횟수 API는 없으므로 도너의 "내 기록"(3회/5회…) 대신
// 실제로 있는 값인 관심 루틴을 같은 카드 디자인으로 보여준다.
// 화면 디자인은 팀원 최신본(mobile/src/screens/main/MyScreen.js) 이식.
const INTEREST_META = {
  hydration: { label: '수분케어', icon: 'selfcare' },
  exercise: { label: '운동', icon: 'exercise' },
  meal: { label: '식사', icon: 'meal' },
  sleep: { label: '수면', icon: 'sleep' },
  skincare: { label: '피부관리', icon: 'selfcare' },
};
const menus = [
  ['알림 설정', '/my/notifications', 'bell'],
  ['개인정보 보호', '/my/privacy', 'privacy'],
  ['이용약관', '/my/terms', 'terms'],
  ['고객센터', '/my/support', 'support'],
];

export default function MyScreen() {
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const profile = useUserStore((s) => s.profile);
  const stats = useUserStore((s) => s.stats);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);

  useFocusEffect(
    useCallback(() => {
      useUserStore.getState().loadStats();
    }, []),
  );

  const interests = (profile?.onboarding?.interestRoutines ?? [])
    .map((key) => INTEREST_META[key])
    .filter(Boolean);

  const confirmLogout = async () => {
    setLogoutOpen(false);
    await useAuthStore.getState().signOut();
    router.replace('/');
  };

  return (
    <View style={s.screen}>
      <Text className="px-[30px] pt-4 text-[28px] font-black text-ink">마이 페이지</Text>
      <ScrollView contentContainerStyle={s.content}>
        <AnimatedEntrance style={s.profile}>
          <View style={s.profileRow}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{profile?.nickname?.[0] ?? 'A'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.name}>{profile?.nickname ?? '–'}</Text>
              <Text style={s.email}>{firebaseUser?.email ?? ''}</Text>
            </View>
            <Pressable style={s.edit} onPress={() => router.push('/my/edit-profile')}>
              <Text style={s.editText}>편집</Text>
            </Pressable>
          </View>
          <View style={s.line} />
          <View style={s.metrics}>
            <Metric label="하트" value={String(stats?.hearts ?? '–')} icon="heart" red />
            <Metric label="리워드" value={String(stats?.rewardPoints ?? '–')} icon="coin" />
            <Metric label="성공한 루틴" value={`${stats?.successfulRoutines ?? 0}회`} icon="check" />
          </View>
        </AnimatedEntrance>

        {interests.length > 0 ? (
          <AnimatedEntrance delay={60} style={s.recordSection}>
            <Text style={s.section}>관심 루틴</Text>
            <View style={s.records}>
              {interests.map((item) => (
                <View key={item.label} style={s.record}>
                  <View style={s.recordIcon}>
                    <Icon name={item.icon} size={24} />
                  </View>
                  <Text style={s.recordName}>{item.label}</Text>
                </View>
              ))}
            </View>
          </AnimatedEntrance>
        ) : null}

        <AnimatedEntrance delay={120} style={s.menus}>
          {menus.map(([label, path, icon], i) => (
            <Pressable key={label} style={[s.menu, i > 0 && s.menuLine]} onPress={() => router.push(path)}>
              <Icon name={icon} size={18} />
              <Text style={s.menuText}>{label}</Text>
              <Text style={s.arrow}>›</Text>
            </Pressable>
          ))}
        </AnimatedEntrance>

        <Pressable style={s.logout} onPress={() => setLogoutOpen(true)}>
          <Text style={s.logoutText}>로그아웃</Text>
        </Pressable>
      </ScrollView>

      {/* 로그아웃 확인 바텀시트 — 반투명 배경 + 아래에서 위로 */}
      <Modal visible={logoutOpen} transparent animationType="slide" onRequestClose={() => setLogoutOpen(false)}>
        <Pressable style={s.dim} onPress={() => setLogoutOpen(false)}>
          <Pressable style={s.sheet} onPress={() => {}}>
            <Text style={s.sheetTitle}>정말 로그아웃 하시겠어요?</Text>
            <View style={s.sheetRow}>
              <Pressable style={s.cancel} onPress={() => setLogoutOpen(false)}>
                <Text style={s.cancelText}>아니오</Text>
              </Pressable>
              <Pressable style={s.confirm} onPress={confirmLogout}>
                <Text style={s.confirmText}>네</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function Metric({ label, value, icon, red }) {
  return (
    <View style={s.metric}>
      <Text style={[s.metricLabel, red && { color: '#d9573b' }]}>{label}</Text>
      <View style={s.metricValue}>
        <Icon name={icon} size={13} />
        <Text style={s.metricValueText}>{value}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f6f3' },
  content: { paddingHorizontal: 30, paddingTop: 16, paddingBottom: 110, gap: 20 },
  profile: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    padding: 20,
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#14453a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#fff' },
  name: { fontSize: 18, fontWeight: '700' },
  email: { marginTop: 2, fontSize: 12, color: '#6b7268' },
  edit: { borderRadius: 99, backgroundColor: '#e5f4e8', paddingHorizontal: 16, paddingVertical: 8 },
  editText: { fontSize: 12, fontWeight: '700' },
  line: { height: 1, backgroundColor: '#e7e3d8', marginVertical: 16 },
  metrics: { flexDirection: 'row' },
  metric: { flex: 1, alignItems: 'center' },
  metricLabel: { fontSize: 10, fontWeight: '600', color: '#6b7268' },
  metricValue: { marginTop: 4, flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricValueText: { fontSize: 15, fontWeight: '700' },
  recordSection: { gap: 10 },
  section: { fontSize: 13, lineHeight: 16, fontWeight: '700', color: '#6b7268' },
  records: {
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    padding: 16,
    flexDirection: 'row',
    gap: 8,
  },
  record: { flex: 1, alignItems: 'center' },
  recordIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#f3efe4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordName: { marginTop: 8, fontSize: 11, lineHeight: 13, fontWeight: '600' },
  menus: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    overflow: 'hidden',
  },
  menu: { height: 50, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLine: { borderTopWidth: 1, borderTopColor: '#e7e3d8' },
  menuText: { flex: 1, fontSize: 13, fontWeight: '500' },
  arrow: { fontSize: 18, color: '#bababa' },
  logout: {
    height: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#d9573b',
    backgroundColor: '#fefefe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#d9573b' },
  dim: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,.4)' },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fefefe',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sheetTitle: { textAlign: 'center', fontSize: 17, fontWeight: '700' },
  sheetRow: { marginTop: 24, flexDirection: 'row', gap: 12 },
  cancel: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e7e3d8',
    backgroundColor: '#fefefe',
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: { fontSize: 14, fontWeight: '700' },
  confirm: { flex: 1, borderRadius: 14, backgroundColor: '#d9573b', paddingVertical: 14, alignItems: 'center' },
  confirmText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
