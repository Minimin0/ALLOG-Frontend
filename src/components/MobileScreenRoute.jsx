import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';
import {
  PrivacyScreen,
  RewardDetailScreen,
  SettingsScreen,
} from '../../mobile/src/screens/details/AccountRewardScreens';

// 세 개의 donor supporting screen만 남긴 의도적인 adapter다. 인증·온보딩·탭·프로필은
// 모두 app/의 production-backed route가 직접 소유하므로 여기서 다시 선택할 수 없다.
const SCREENS = { Privacy: PrivacyScreen, RewardDetail: RewardDetailScreen, Settings: SettingsScreen };

function decodeParams(params) {
  return Object.fromEntries(Object.entries(params).map(([key, value]) => {
    const raw = Array.isArray(value) ? value[0] : value;
    if (typeof raw !== 'string') return [key, raw];
    try { return [key, JSON.parse(raw)]; } catch { return [key, raw]; }
  }));
}

export default function MobileScreenRoute({ screen }) {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const route = useMemo(() => ({ params: decodeParams(searchParams) }), [searchParams]);
  const Screen = SCREENS[screen];
  if (!Screen) throw new Error(`Unknown legacy adapter screen: ${screen}`);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <Screen navigation={{ goBack: () => router.back() }} route={route} />
    </SafeAreaView>
  );
}
