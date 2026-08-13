import { Navigate, Route, Routes } from 'react-router-dom';

// 개발용
import DevHomePage from '@/pages/DevHomePage.jsx';
import PlaceholderPage from '@/pages/_PlaceholderPage.jsx';

// 인증 / 온보딩 (HW)
import StartPage from '@/pages/auth/StartPage.jsx';
import LoginPage from '@/pages/auth/LoginPage.jsx';
import SignUpPhonePage from '@/pages/auth/SignUpPhonePage.jsx';
import SignUpAccountPage from '@/pages/auth/SignUpAccountPage.jsx';
import FirebaseDebugPage from '@/pages/auth/FirebaseDebugPage.jsx';
import BasicInfoPage from '@/pages/onboarding/BasicInfoPage.jsx';
import HabitSelectPage from '@/pages/onboarding/HabitSelectPage.jsx';
import CoachStylePage from '@/pages/onboarding/CoachStylePage.jsx';
import LifestylePage from '@/pages/onboarding/LifestylePage.jsx';
import OnboardingCompletePage from '@/pages/onboarding/OnboardingCompletePage.jsx';

// 홈 / 탐색 / 리워드 / 마이 / 하트 (HW)
import HomePage from '@/pages/home/HomePage.jsx';
import ExplorePage from '@/pages/explore/ExplorePage.jsx';
import GroupDetailPage from '@/pages/explore/GroupDetailPage.jsx';
import RewardPage from '@/pages/reward/RewardPage.jsx';
import RewardDetailPage from '@/pages/reward/RewardDetailPage.jsx';
import MyPage from '@/pages/my/MyPage.jsx';
import EditProfilePage from '@/pages/my/EditProfilePage.jsx';
import SettingsPage from '@/pages/my/SettingsPage.jsx';
import NotificationSettingsPage from '@/pages/my/NotificationSettingsPage.jsx';
import PrivacyPage from '@/pages/my/PrivacyPage.jsx';
import TermsPage from '@/pages/my/TermsPage.jsx';
import CustomerSupportPage from '@/pages/my/CustomerSupportPage.jsx';
import HeartEventPage from '@/pages/heart/HeartEventPage.jsx';

// 그룹 생성 / 초대 / 대기 (HW)
import CreateGroupPage from '@/pages/group/CreateGroupPage.jsx';
import GroupCreatedPage from '@/pages/group/GroupCreatedPage.jsx';
import WaitingRoomPage from '@/pages/group/WaitingRoomPage.jsx';
import JoinCompletePage from '@/pages/group/JoinCompletePage.jsx';
import InviteGroupPage from '@/pages/group/InviteGroupPage.jsx';

// 내 그룹 탭 (banana)
import MyGroupPage from '@/pages/group/MyGroupPage.jsx';
import GroupRankingPage from '@/pages/group/GroupRankingPage.jsx';
import RankingCriteriaPage from '@/pages/group/RankingCriteriaPage.jsx';
import FullRankingPage from '@/pages/group/FullRankingPage.jsx';
import GroupResultPage from '@/pages/group/GroupResultPage.jsx';
import GroupFeedPage from '@/pages/group/GroupFeedPage.jsx';
import GroupInfoPage from '@/pages/group/GroupInfoPage.jsx';

// 인증 촬영 플로우 (banana)
import VerificationPage from '@/pages/verification/VerificationPage.jsx';
import CameraPage from '@/pages/verification/CameraPage.jsx';
import VerificationPreviewPage from '@/pages/verification/VerificationPreviewPage.jsx';
import VerificationLoadingPage from '@/pages/verification/VerificationLoadingPage.jsx';
import VerificationResultPage from '@/pages/verification/VerificationResultPage.jsx';

// 재인증 / AI 코칭 (banana)
import ReportPage from '@/pages/report/ReportPage.jsx';
import AiCoachPage from '@/pages/ai/AiCoachPage.jsx';

// 통합 라우터: HW 껍데기(진입·인증·온보딩·홈·탐색·리워드·마이·그룹관리)
//  + banana 기능(내 그룹 탭·인증촬영·랭킹·AI 코치)을 합집합으로 매핑.
// React Router v6는 정적 경로를 동적(:groupId)보다 우선 매칭하므로 /group/create 등이 안전.
export default function AppRouter() {
  return (
    <Routes>
      {/* 진입: 시작 화면(로그인 플로우) — HW */}
      <Route path="/" element={<StartPage />} />
      <Route path="/dev" element={<DevHomePage />} />

      {/* 인증 (HW) */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup-phone" element={<SignUpPhonePage />} />
      <Route path="/auth/signup-account" element={<SignUpAccountPage />} />
      <Route path="/auth/firebase-debug" element={<FirebaseDebugPage />} />

      {/* 온보딩 (HW) */}
      <Route path="/onboarding/basic-info" element={<BasicInfoPage />} />
      <Route path="/onboarding/habits" element={<HabitSelectPage />} />
      <Route path="/onboarding/coach-style" element={<CoachStylePage />} />
      <Route path="/onboarding/lifestyle" element={<LifestylePage />} />
      <Route path="/onboarding/complete" element={<OnboardingCompletePage />} />

      {/* 홈 / 탐색 / 리워드 / 마이 / 하트 (HW) */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/explore/group/:groupId" element={<GroupDetailPage />} />
      <Route path="/reward" element={<RewardPage />} />
      <Route path="/reward/:rewardId" element={<RewardDetailPage />} />
      <Route path="/my" element={<MyPage />} />
      <Route path="/my/edit-profile" element={<EditProfilePage />} />
      <Route path="/my/settings" element={<SettingsPage />} />
      <Route path="/my/notifications" element={<NotificationSettingsPage />} />
      <Route path="/my/privacy" element={<PrivacyPage />} />
      <Route path="/my/terms" element={<TermsPage />} />
      <Route path="/my/support" element={<CustomerSupportPage />} />
      <Route path="/heart-event" element={<HeartEventPage />} />

      {/* 그룹 생성 / 초대 / 대기 (HW) */}
      <Route path="/group/create" element={<CreateGroupPage />} />
      <Route path="/group/created" element={<GroupCreatedPage />} />
      <Route path="/group/waiting-room" element={<WaitingRoomPage />} />
      <Route path="/group/join-complete/:groupId" element={<JoinCompletePage />} />
      <Route path="/group/join-complete" element={<JoinCompletePage />} />
      <Route path="/group/invite" element={<InviteGroupPage />} />

      {/* 내 그룹: 부모 레이아웃 + 중첩 탭 (banana) */}
      <Route path="/group/:groupId" element={<MyGroupPage />}>
        <Route index element={<Navigate to="ranking" replace />} />
        <Route path="ranking" element={<GroupRankingPage />} />
        <Route path="feed" element={<GroupFeedPage />} />
        <Route path="info" element={<GroupInfoPage />} />
      </Route>
      <Route path="/group/:groupId/ranking/criteria" element={<RankingCriteriaPage />} />
      <Route path="/ranking" element={<FullRankingPage />} />
      <Route path="/group/:groupId/result" element={<GroupResultPage />} />

      {/* 인증 촬영 플로우 (banana) */}
      <Route path="/group/:groupId/verify" element={<VerificationPage />} />
      <Route path="/group/:groupId/verify/camera" element={<CameraPage />} />
      <Route path="/group/:groupId/verify/preview" element={<VerificationPreviewPage />} />
      <Route path="/group/:groupId/verify/loading" element={<VerificationLoadingPage />} />
      <Route path="/group/:groupId/verify/result" element={<VerificationResultPage />} />

      {/* 재인증 / AI 코칭 (banana) */}
      <Route path="/report" element={<ReportPage />} />
      <Route path="/ai" element={<AiCoachPage />} />

      {/* HW 평면 경로 → banana 정규 경로 리다이렉트 (기존 링크 호환; mock 그룹 g1) */}
      <Route path="/group/my" element={<Navigate to="/group/g1" replace />} />
      <Route path="/group/feed" element={<Navigate to="/group/g1/feed" replace />} />
      <Route path="/group/ranking-full" element={<Navigate to="/ranking" replace />} />
      <Route path="/ai-coach" element={<Navigate to="/ai" replace />} />
      <Route path="/verification/camera" element={<Navigate to="/group/g1/verify/camera" replace />} />

      {/* 404 */}
      <Route
        path="*"
        element={<PlaceholderPage title="페이지를 찾을 수 없어요" note="경로를 확인해주세요" />}
      />
    </Routes>
  );
}
