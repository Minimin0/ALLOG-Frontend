import { useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme';

import StartScreen from '../../mobile/src/screens/auth/StartScreen';
import LoginScreen from '../../mobile/src/screens/auth/LoginScreen';
import SignUpPhoneScreen from '../../mobile/src/screens/auth/SignUpPhoneScreen';
import SignUpAccountScreen from '../../mobile/src/screens/auth/SignUpAccountScreen';
import BasicInfoScreen from '../../mobile/src/screens/onboarding/BasicInfoScreen';
import HabitScreen from '../../mobile/src/screens/onboarding/HabitScreen';
import CoachStyleScreen from '../../mobile/src/screens/onboarding/CoachStyleScreen';
import LifestyleScreen from '../../mobile/src/screens/onboarding/LifestyleScreen';
import CompleteScreen from '../../mobile/src/screens/onboarding/CompleteScreen';
import HomeScreen from '../../mobile/src/screens/main/HomeNative';
import ExploreScreen from '../../mobile/src/screens/main/ExploreScreen';
import MyGroupScreen from '../../mobile/src/screens/main/MyGroupNative';
import RewardScreen from '../../mobile/src/screens/main/RewardScreen';
import MyScreen from '../../mobile/src/screens/main/MyScreen';
import {
  CreateGroupScreen, GroupCreatedScreen, WaitingRoomScreen, JoinByCodeScreen,
  JoinCompleteScreen, InviteGroupScreen,
} from '../../mobile/src/screens/group/GroupFlowScreens';
import {
  VerificationStartScreen, CameraScreen, PreviewScreen,
  VerificationLoadingScreen, VerificationResultScreen,
} from '../../mobile/src/screens/verification/VerificationScreens';
import {
  RewardDetailScreen, EditProfileScreen, NotificationsScreen, PrivacyScreen,
  TermsScreen, SupportScreen, SettingsScreen,
} from '../../mobile/src/screens/details/AccountRewardScreens';
import { AiCoachScreen, ReportScreen } from '../../mobile/src/screens/details/AuxScreens';
import {
  FullRankingScreen, RankingCriteriaScreen, GroupResultScreen, ExploreGroupDetailScreen,
} from '../../mobile/src/screens/group/GroupMoreScreens';
import {
  FirebaseDebugScreen, PreferPeriodScreen, GroupRecommendScreen,
  InviteLandingScreen, DevHomeScreen, PlaceholderScreen,
} from '../../mobile/src/screens/utility/UtilityScreens';

const SCREENS = {
  Start: StartScreen, Login: LoginScreen, SignUpPhone: SignUpPhoneScreen,
  SignUpAccount: SignUpAccountScreen, BasicInfo: BasicInfoScreen, Habits: HabitScreen,
  CoachStyle: CoachStyleScreen, Lifestyle: LifestyleScreen, OnboardingComplete: CompleteScreen,
  Home: HomeScreen, Explore: ExploreScreen, Group: MyGroupScreen, Reward: RewardScreen, My: MyScreen,
  CreateGroup: CreateGroupScreen, GroupCreated: GroupCreatedScreen, WaitingRoom: WaitingRoomScreen,
  JoinByCode: JoinByCodeScreen, JoinComplete: JoinCompleteScreen, InviteGroup: InviteGroupScreen,
  Verification: VerificationStartScreen, Camera: CameraScreen, Preview: PreviewScreen,
  VerificationLoading: VerificationLoadingScreen, VerificationResult: VerificationResultScreen,
  RewardDetail: RewardDetailScreen, EditProfile: EditProfileScreen, Notifications: NotificationsScreen,
  Privacy: PrivacyScreen, Terms: TermsScreen, Support: SupportScreen, Settings: SettingsScreen,
  AiCoach: AiCoachScreen, Report: ReportScreen,
  FullRanking: FullRankingScreen, RankingCriteria: RankingCriteriaScreen, GroupResult: GroupResultScreen,
  GroupDetail: ExploreGroupDetailScreen, FirebaseDebug: FirebaseDebugScreen,
  PreferPeriod: PreferPeriodScreen, GroupRecommend: GroupRecommendScreen,
  InviteLanding: InviteLandingScreen, DevHome: DevHomeScreen, Placeholder: PlaceholderScreen,
};

const PATHS = {
  Start: '/', Login: '/auth/login', SignUpPhone: '/auth/signup-phone',
  SignUpAccount: '/auth/signup-account', BasicInfo: '/onboarding/basic-info',
  Habits: '/onboarding/habits', CoachStyle: '/onboarding/coach-style',
  Lifestyle: '/onboarding/lifestyle', OnboardingComplete: '/onboarding/complete',
  PreferPeriod: '/onboarding/lifestyle', GroupRecommend: '/onboarding/complete',
  Home: '/(tabs)/home', Group: '/(tabs)/group', Explore: '/(tabs)/explore',
  Reward: '/(tabs)/reward', My: '/(tabs)/my', CreateGroup: '/group/create',
  GroupCreated: '/group/created', WaitingRoom: '/group/waiting-room', JoinByCode: '/group/join',
  JoinComplete: '/group/join-complete', InviteGroup: '/group/invite',
  Verification: '/verify', Camera: '/verify/camera', Preview: '/verify/preview',
  VerificationLoading: '/verify/loading', VerificationResult: '/verify/result',
  RewardDetail: '/reward/reward', EditProfile: '/my/edit-profile', Notifications: '/my/notifications',
  Privacy: '/my/privacy', Terms: '/my/terms', Support: '/my/support', Settings: '/my/settings',
  AiCoach: '/ai', Report: '/report', FullRanking: '/ranking',
  RankingCriteria: '/ranking', GroupResult: '/group/join-complete', GroupDetail: '/explore/group/group',
  FirebaseDebug: '/auth/firebase-debug', InviteLanding: '/group/invite', Placeholder: '/my/settings',
};

// /mobile의 Stack.Group에서 상단 Safe Area를 제공하던 HW 상세 화면들.
// 탭 화면은 app/(tabs)/_layout.jsx가 이미 처리하고, bananayeon 화면은 이
// 어댑터를 사용하지 않으므로 각 영역의 레이아웃에 영향을 주지 않는다.
const TOP_SAFE_AREA_SCREENS = new Set([
  'CreateGroup', 'GroupCreated', 'WaitingRoom', 'JoinByCode', 'JoinComplete',
  'InviteGroup', 'RewardDetail', 'EditProfile', 'Notifications', 'Privacy',
  'Terms', 'Support', 'Settings', 'GroupDetail', 'FirebaseDebug',
  'InviteLanding',
]);

function encodeParams(params = {}) {
  return Object.fromEntries(Object.entries(params).map(([key, value]) => [
    key,
    typeof value === 'string' ? value : JSON.stringify(value),
  ]));
}

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
  const navigation = useMemo(() => {
    const target = (name, params) => {
      if (name === 'Home' && params?.screen) return PATHS[params.screen] || PATHS.Home;
      return PATHS[name] || PATHS.Placeholder;
    };
    const href = (name, params) => ({ pathname: target(name, params), params: encodeParams(params) });
    return {
      navigate: (name, params) => router.push(href(name, params)),
      push: (name, params) => router.push(href(name, params)),
      replace: (name, params) => router.replace(href(name, params)),
      reset: ({ routes }) => {
        const last = routes?.[routes.length - 1];
        if (last) router.replace(href(last.name, last.params));
      },
      goBack: () => router.back(),
    };
  }, [router]);
  const Screen = SCREENS[screen] || PlaceholderScreen;
  const content = <Screen navigation={navigation} route={route} />;

  if (!TOP_SAFE_AREA_SCREENS.has(screen)) return content;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      {content}
    </SafeAreaView>
  );
}
