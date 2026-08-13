import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import HeartEventPage from "../pages/heart/HeartEventPage";
import CreateGroupPage from "../pages/group/CreateGroupPage";
import GroupCreatedPage from "../pages/group/GroupCreatedPage";
import WaitingRoomPage from "../pages/group/WaitingRoomPage";
import JoinCompletePage from "../pages/group/JoinCompletePage";
import MyGroupPage from "../pages/group/MyGroupPage";
import GroupFeedPage from "../pages/group/GroupFeedPage";
import FullRankingPage from "../pages/group/FullRankingPage";
import InviteGroupPage from "../pages/group/InviteGroupPage";
import AiCoachPage from "../pages/ai/AiCoachPage";
import CameraPage from "../pages/verification/CameraPage";

function AppRouter() {
  return (
    <BrowserRouter>
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
        <Route
          path="/my/notifications"
          element={<NotificationSettingsPage />}
        />
        <Route path="/my/privacy" element={<PrivacyPage />} />
        <Route path="/my/terms" element={<TermsPage />} />
        <Route path="/my/support" element={<CustomerSupportPage />} />
        <Route path="/heart-event" element={<HeartEventPage />} />
        <Route path="/group/create" element={<CreateGroupPage />} />
        <Route path="/group/created" element={<GroupCreatedPage />} />
        <Route path="/group/waiting-room" element={<WaitingRoomPage />} />
        <Route
          path="/group/join-complete/:groupId"
          element={<JoinCompletePage />}
        />
        <Route path="/group/join-complete" element={<JoinCompletePage />} />
        <Route path="/group/my" element={<MyGroupPage />} />
        <Route path="/group/feed" element={<GroupFeedPage />} />
        <Route path="/group/ranking-full" element={<FullRankingPage />} />
        <Route path="/group/invite" element={<InviteGroupPage />} />
        <Route path="/ai-coach" element={<AiCoachPage />} />
        <Route path="/verification/camera" element={<CameraPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
