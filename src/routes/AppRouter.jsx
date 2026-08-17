import { Navigate, Routes, Route } from "react-router-dom";
import StartPage from "../pages/auth/StartPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPhonePage from "../pages/auth/SignUpPhonePage";
import SignUpAccountPage from "../pages/auth/SignUpAccountPage";
import FirebaseDebugPage from "../pages/auth/FirebaseDebugPage";
import BasicInfoPage from "../pages/onboarding/BasicInfoPage";
import HabitSelectPage from "../pages/onboarding/HabitSelectPage";
import CoachStylePage from "../pages/onboarding/CoachStylePage";
import LifestylePage from "../pages/onboarding/LifestylePage";
import OnboardingCompletePage from "../pages/onboarding/OnboardingCompletePage";

import HomePage from "../pages/home/HomePage";
import ExplorePage from "../pages/explore/ExplorePage";
import GroupDetailPage from "../pages/explore/GroupDetailPage";
import RewardPage from "../pages/reward/RewardPage";
import RewardDetailPage from "../pages/reward/RewardDetailPage";
import MyPage from "../pages/my/MyPage";
import EditProfilePage from "../pages/my/EditProfilePage";
import SettingsPage from "../pages/my/SettingsPage";
import NotificationSettingsPage from "../pages/my/NotificationSettingsPage";
import PrivacyPage from "../pages/my/PrivacyPage";
import TermsPage from "../pages/my/TermsPage";
import CustomerSupportPage from "../pages/my/CustomerSupportPage";
import CreateGroupPage from "../pages/group/CreateGroupPage";
import GroupCreatedPage from "../pages/group/GroupCreatedPage";
import WaitingRoomPage from "../pages/group/WaitingRoomPage";
import JoinCompletePage from "../pages/group/JoinCompletePage";
import InviteGroupPage from "../pages/group/InviteGroupPage";
import JoinByCodePage from "../pages/group/JoinByCodePage";
import AiCoachPage from "../pages/ai/AiCoachPage";

// 내 그룹 (인증·랭킹) — bananayeon 브랜치에서 병합
import MyGroupPage from "../pages/group/MyGroupPage";
import GroupRankingPage from "../pages/group/GroupRankingPage";
import RankingCriteriaPage from "../pages/group/RankingCriteriaPage";
import FullRankingPage from "../pages/group/FullRankingPage";
import GroupResultPage from "../pages/group/GroupResultPage";
import GroupFeedPage from "../pages/group/GroupFeedPage";
import GroupInfoPage from "../pages/group/GroupInfoPage";

// 인증 촬영 플로우 — bananayeon 브랜치에서 병합
import VerificationPage from "../pages/verification/VerificationPage";
import CameraPage from "../pages/verification/CameraPage";
import VerificationPreviewPage from "../pages/verification/VerificationPreviewPage";
import VerificationLoadingPage from "../pages/verification/VerificationLoadingPage";
import VerificationResultPage from "../pages/verification/VerificationResultPage";

// 재인증 / 신고 — bananayeon 브랜치에서 병합
import ReportPage from "../pages/report/ReportPage";

// 404
import PlaceholderPage from "../pages/_PlaceholderPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup-phone" element={<SignUpPhonePage />} />
      <Route path="/auth/signup-account" element={<SignUpAccountPage />} />
      <Route path="/auth/firebase-debug" element={<FirebaseDebugPage />} />
      <Route path="/onboarding/basic-info" element={<BasicInfoPage />} />
      <Route path="/onboarding/habits" element={<HabitSelectPage />} />
      <Route path="/onboarding/coach-style" element={<CoachStylePage />} />
      <Route path="/onboarding/lifestyle" element={<LifestylePage />} />
      <Route
        path="/onboarding/complete"
        element={<OnboardingCompletePage />}
      />

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

      {/* 그룹 생성 / 초대 / 대기방 (HW) */}
      <Route path="/group/create" element={<CreateGroupPage />} />
      <Route path="/group/created" element={<GroupCreatedPage />} />
      <Route path="/group/waiting-room" element={<WaitingRoomPage />} />
      <Route
        path="/group/join-complete/:groupId"
        element={<JoinCompletePage />}
      />
      <Route path="/group/join-complete" element={<JoinCompletePage />} />
      <Route path="/group/invite" element={<InviteGroupPage />} />
      <Route path="/group/join" element={<JoinByCodePage />} />

      {/* 내 그룹: 부모 레이아웃 아래 탭들을 중첩 (bananayeon) */}
      <Route path="/group/:groupId" element={<MyGroupPage />}>
        <Route index element={<Navigate to="ranking" replace />} />
        <Route path="ranking" element={<GroupRankingPage />} />
        <Route path="feed" element={<GroupFeedPage />} />
        <Route path="info" element={<GroupInfoPage />} />
      </Route>

      {/* 순위 평가 기준 (탭 밖 전체화면) */}
      <Route
        path="/group/:groupId/ranking/criteria"
        element={<RankingCriteriaPage />}
      />

      {/* 전체 랭킹 */}
      <Route path="/group/ranking-full" element={<FullRankingPage />} />

      {/* 합산(챌린지 결과) */}
      <Route path="/group/:groupId/result" element={<GroupResultPage />} />

      {/* 인증 촬영 플로우 (전체화면, 탭 밖) */}
      <Route path="/group/:groupId/verify" element={<VerificationPage />} />
      <Route
        path="/group/:groupId/verify/camera"
        element={<CameraPage />}
      />
      <Route
        path="/group/:groupId/verify/preview"
        element={<VerificationPreviewPage />}
      />
      <Route
        path="/group/:groupId/verify/loading"
        element={<VerificationLoadingPage />}
      />
      <Route
        path="/group/:groupId/verify/result"
        element={<VerificationResultPage />}
      />
      {/* groupId 없이 진입하는 기존 진입점(홈/하트이벤트)을 위한 기본 촬영 경로 */}
      <Route path="/verification/camera" element={<CameraPage />} />

      {/* 재인증 / 신고 */}
      <Route path="/report" element={<ReportPage />} />

      {/* AI 코칭 */}
      <Route path="/ai-coach" element={<AiCoachPage />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <PlaceholderPage
            title="페이지를 찾을 수 없어요"
            note="경로를 확인해주세요"
          />
        }
      />
    </Routes>
  );
}

export default AppRouter;
