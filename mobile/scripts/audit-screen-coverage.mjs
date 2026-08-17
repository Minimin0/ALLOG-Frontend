import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const mobileRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const webPagesRoot = path.resolve(mobileRoot, "..", "src", "pages");
const appSource = fs.readFileSync(path.join(mobileRoot, "App.js"), "utf8");

const mappings = {
  "_PlaceholderPage.jsx": [
    "src/screens/utility/UtilityScreens.js",
    "PlaceholderScreen",
    "Placeholder",
  ],
  "DevHomePage.jsx": [
    "src/screens/utility/UtilityScreens.js",
    "DevHomeScreen",
    "DevHome",
  ],
  "ai/AiCoachPage.jsx": [
    "src/screens/details/AuxScreens.js",
    "AiCoachScreen",
    "AiCoach",
  ],
  "auth/FirebaseDebugPage.jsx": [
    "src/screens/utility/UtilityScreens.js",
    "FirebaseDebugScreen",
    "FirebaseDebug",
  ],
  "auth/LoginPage.jsx": [
    "src/screens/auth/LoginScreen.js",
    "LoginScreen",
    "Login",
  ],
  "auth/SignUpAccountPage.jsx": [
    "src/screens/auth/SignUpAccountScreen.js",
    "SignUpAccountScreen",
    "SignUpAccount",
  ],
  "auth/SignUpPhonePage.jsx": [
    "src/screens/auth/SignUpPhoneScreen.js",
    "SignUpPhoneScreen",
    "SignUpPhone",
  ],
  "auth/StartPage.jsx": [
    "src/screens/auth/StartScreen.js",
    "StartScreen",
    "Start",
  ],
  "explore/ExplorePage.jsx": [
    "src/screens/main/ExploreScreen.js",
    "ExploreScreen",
    "Explore",
  ],
  "explore/GroupDetailPage.jsx": [
    "src/screens/group/GroupMoreScreens.js",
    "ExploreGroupDetailScreen",
    "GroupDetail",
  ],
  "group/CreateGroupPage.jsx": [
    "src/screens/group/GroupFlowScreens.js",
    "CreateGroupScreen",
    "CreateGroup",
  ],
  "group/FullRankingPage.jsx": [
    "src/screens/group/GroupMoreScreens.js",
    "FullRankingScreen",
    "FullRanking",
  ],
  "group/GroupCreatedPage.jsx": [
    "src/screens/group/GroupFlowScreens.js",
    "GroupCreatedScreen",
    "GroupCreated",
  ],
  "group/GroupFeedPage.jsx": [
    "src/screens/main/MyGroupNative.js",
    "Feed",
    "embedded:Group",
  ],
  "group/GroupInfoPage.jsx": [
    "src/screens/main/MyGroupNative.js",
    "Info",
    "embedded:Group",
  ],
  "group/GroupRankingPage.jsx": [
    "src/screens/main/MyGroupNative.js",
    "Ranking",
    "embedded:Group",
  ],
  "group/GroupResultPage.jsx": [
    "src/screens/group/GroupMoreScreens.js",
    "GroupResultScreen",
    "GroupResult",
  ],
  "group/InviteGroupPage.jsx": [
    "src/screens/group/GroupFlowScreens.js",
    "InviteGroupScreen",
    "InviteGroup",
  ],
  "group/InviteLandingPage.jsx": [
    "src/screens/utility/UtilityScreens.js",
    "InviteLandingScreen",
    "InviteLanding",
  ],
  "group/JoinByCodePage.jsx": [
    "src/screens/group/GroupFlowScreens.js",
    "JoinByCodeScreen",
    "JoinByCode",
  ],
  "group/JoinCompletePage.jsx": [
    "src/screens/group/GroupFlowScreens.js",
    "JoinCompleteScreen",
    "JoinComplete",
  ],
  "group/MyGroupPage.jsx": [
    "src/screens/main/MyGroupNative.js",
    "MyGroupNative",
    "Group",
  ],
  "group/RankingCriteriaPage.jsx": [
    "src/screens/group/GroupMoreScreens.js",
    "RankingCriteriaScreen",
    "RankingCriteria",
  ],
  "group/WaitingRoomPage.jsx": [
    "src/screens/group/GroupFlowScreens.js",
    "WaitingRoomScreen",
    "WaitingRoom",
  ],
  "heart/HeartEventPage.jsx": [
    "src/screens/details/AuxScreens.js",
    "HeartEventScreen",
    "HeartEvent",
  ],
  "home/HomePage.jsx": [
    "src/screens/main/HomeNative.js",
    "HomeNative",
    "HomeTab",
  ],
  "my/CustomerSupportPage.jsx": [
    "src/screens/details/AccountRewardScreens.js",
    "SupportScreen",
    "Support",
  ],
  "my/EditProfilePage.jsx": [
    "src/screens/details/AccountRewardScreens.js",
    "EditProfileScreen",
    "EditProfile",
  ],
  "my/MyPage.jsx": ["src/screens/main/MyScreen.js", "MyScreen", "My"],
  "my/NotificationSettingsPage.jsx": [
    "src/screens/details/AccountRewardScreens.js",
    "NotificationsScreen",
    "Notifications",
  ],
  "my/PrivacyPage.jsx": [
    "src/screens/details/AccountRewardScreens.js",
    "PrivacyScreen",
    "Privacy",
  ],
  "my/SettingsPage.jsx": [
    "src/screens/details/AccountRewardScreens.js",
    "SettingsScreen",
    "Settings",
  ],
  "my/TermsPage.jsx": [
    "src/screens/details/AccountRewardScreens.js",
    "TermsScreen",
    "Terms",
  ],
  "onboarding/BasicInfoPage.jsx": [
    "src/screens/onboarding/BasicInfoScreen.js",
    "BasicInfoScreen",
    "BasicInfo",
  ],
  "onboarding/CoachStylePage.jsx": [
    "src/screens/onboarding/CoachStyleScreen.js",
    "CoachStyleScreen",
    "CoachStyle",
  ],
  "onboarding/GroupRecommendPage.jsx": [
    "src/screens/utility/UtilityScreens.js",
    "GroupRecommendScreen",
    "GroupRecommend",
  ],
  "onboarding/HabitSelectPage.jsx": [
    "src/screens/onboarding/HabitScreen.js",
    "HabitScreen",
    "Habits",
  ],
  "onboarding/LifestylePage.jsx": [
    "src/screens/onboarding/LifestyleScreen.js",
    "LifestyleScreen",
    "Lifestyle",
  ],
  "onboarding/OnboardingCompletePage.jsx": [
    "src/screens/onboarding/CompleteScreen.js",
    "CompleteScreen",
    "OnboardingComplete",
  ],
  "onboarding/OnboardingShell.jsx": [
    "src/components/OnboardingShell.js",
    "OnboardingShell",
    "embedded:onboarding",
  ],
  "onboarding/PreferPeriodPage.jsx": [
    "src/screens/utility/UtilityScreens.js",
    "PreferPeriodScreen",
    "PreferPeriod",
  ],
  "report/ReportPage.jsx": [
    "src/screens/details/AuxScreens.js",
    "ReportScreen",
    "Report",
  ],
  "reward/RewardDetailPage.jsx": [
    "src/screens/details/AccountRewardScreens.js",
    "RewardDetailScreen",
    "RewardDetail",
  ],
  "reward/RewardPage.jsx": [
    "src/screens/main/RewardScreen.js",
    "RewardScreen",
    "Reward",
  ],
  "verification/CameraPage.jsx": [
    "src/screens/verification/VerificationScreens.js",
    "CameraScreen",
    "Camera",
  ],
  "verification/VerificationLoadingPage.jsx": [
    "src/screens/verification/VerificationScreens.js",
    "VerificationLoadingScreen",
    "VerificationLoading",
  ],
  "verification/VerificationPage.jsx": [
    "src/screens/verification/VerificationScreens.js",
    "VerificationStartScreen",
    "Verification",
  ],
  "verification/VerificationPreviewPage.jsx": [
    "src/screens/verification/VerificationScreens.js",
    "PreviewScreen",
    "Preview",
  ],
  "verification/VerificationResultPage.jsx": [
    "src/screens/verification/VerificationScreens.js",
    "VerificationResultScreen",
    "VerificationResult",
  ],
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory()
      ? walk(full)
      : full.endsWith(".jsx")
        ? [full]
        : [];
  });
}

const pages = walk(webPagesRoot)
  .map((file) => path.relative(webPagesRoot, file).replaceAll("\\", "/"))
  .sort();
const errors = [];
for (const page of pages) {
  const mapping = mappings[page];
  if (!mapping) {
    errors.push(`${page}: mapping missing`);
    continue;
  }
  const [relativeFile, symbol, route] = mapping;
  const nativeFile = path.join(mobileRoot, relativeFile);
  if (!fs.existsSync(nativeFile)) {
    errors.push(`${page}: ${relativeFile} missing`);
    continue;
  }
  const source = fs.readFileSync(nativeFile, "utf8");
  if (!source.includes(symbol))
    errors.push(`${page}: symbol ${symbol} missing in ${relativeFile}`);
  if (
    !route.startsWith("embedded:") &&
    !appSource.includes(`name="${route}"`) &&
    !fs
      .readFileSync(path.join(mobileRoot, "src/navigation/MainTabs.js"), "utf8")
      .includes(`name="${route}"`)
  )
    errors.push(`${page}: route ${route} not registered`);
}
for (const mappedPage of Object.keys(mappings))
  if (!pages.includes(mappedPage))
    errors.push(`${mappedPage}: mapping has no source page`);

console.log(`Source pages: ${pages.length}`);
console.log(`Mapped pages: ${Object.keys(mappings).length}`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Screen coverage audit passed.");
