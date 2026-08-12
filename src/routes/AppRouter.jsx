import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "../pages/auth/StartPage";
import LoginPage from "../pages/auth/LoginPage";
import SignUpPhonePage from "../pages/auth/SignUpPhonePage";
import SignUpAccountPage from "../pages/auth/SignUpAccountPage";
import BasicInfoPage from "../pages/onboarding/BasicInfoPage";
import HabitSelectPage from "../pages/onboarding/HabitSelectPage";
import CoachStylePage from "../pages/onboarding/CoachStylePage";
import LifestylePage from "../pages/onboarding/LifestylePage";
import GroupRecommendPage from "../pages/onboarding/GroupRecommendPage";
import OnboardingCompletePage from "../pages/onboarding/OnboardingCompletePage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup-phone" element={<SignUpPhonePage />} />
        <Route path="/auth/signup-account" element={<SignUpAccountPage />} />
        <Route path="/onboarding/basic-info" element={<BasicInfoPage />} />
        <Route path="/onboarding/habits" element={<HabitSelectPage />} />
        <Route path="/onboarding/coach-style" element={<CoachStylePage />} />
        <Route path="/onboarding/lifestyle" element={<LifestylePage />} />
        <Route
          path="/onboarding/group-recommend"
          element={<GroupRecommendPage />}
        />
        <Route
          path="/onboarding/complete"
          element={<OnboardingCompletePage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
