import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Text, TextInput } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppStateProvider } from "./src/state/AppState";
import StartScreen from "./src/screens/auth/StartScreen";
import LoginScreen from "./src/screens/auth/LoginScreen";
import SignUpAccountScreen from "./src/screens/auth/SignUpAccountScreen";
import BasicInfoScreen from "./src/screens/onboarding/BasicInfoScreen";
import HabitScreen from "./src/screens/onboarding/HabitScreen";
import CoachStyleScreen from "./src/screens/onboarding/CoachStyleScreen";
import LifestyleScreen from "./src/screens/onboarding/LifestyleScreen";
import CompleteScreen from "./src/screens/onboarding/CompleteScreen";
import MainTabs from "./src/navigation/MainTabs";
import {
  CreateGroupScreen,
  GroupCreatedScreen,
  WaitingRoomScreen,
  JoinByCodeScreen,
  JoinCompleteScreen,
  InviteGroupScreen,
} from "./src/screens/group/GroupFlowScreens";
import {
  VerificationStartScreen,
  CameraScreen,
  PreviewScreen,
  VerificationLoadingScreen,
  VerificationResultScreen,
} from "./src/screens/verification/VerificationScreens";
import {
  RewardDetailScreen,
  EditProfileScreen,
  NotificationsScreen,
  PrivacyScreen,
  TermsScreen,
  SupportScreen,
  SettingsScreen,
} from "./src/screens/details/AccountRewardScreens";
import {
  AiCoachScreen,
  HeartEventScreen,
  ReportScreen,
} from "./src/screens/details/AuxScreens";
import {
  FullRankingScreen,
  RankingCriteriaScreen,
  GroupResultScreen,
  ExploreGroupDetailScreen,
} from "./src/screens/group/GroupMoreScreens";
import {
  PreferPeriodScreen,
  GroupRecommendScreen,
  InviteLandingScreen,
  DevHomeScreen,
  PlaceholderScreen,
} from "./src/screens/utility/UtilityScreens";

const Stack = createNativeStackNavigator();
const topSafeAreaLayout = ({ children }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f6f3" }} edges={["top"]}>
    {children}
  </SafeAreaView>
);

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [
  { fontFamily: "Pretendard" },
  Text.defaultProps.style,
];
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = [
  { fontFamily: "Pretendard" },
  TextInput.defaultProps.style,
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Pretendard: require("./assets/fonts/PretendardVariable.ttf"),
  });
  if (!fontsLoaded) return null;
  return (
    <AppStateProvider>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor="#f7f6f3" />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{ headerShown: false, animation: "fade" }}
          >
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="SignUpAccount"
              component={SignUpAccountScreen}
            />
            <Stack.Screen name="BasicInfo" component={BasicInfoScreen} />
            <Stack.Screen name="Habits" component={HabitScreen} />
            <Stack.Screen name="CoachStyle" component={CoachStyleScreen} />
            <Stack.Screen name="Lifestyle" component={LifestyleScreen} />
            <Stack.Screen
              name="OnboardingComplete"
              component={CompleteScreen}
            />
            <Stack.Screen name="PreferPeriod" component={PreferPeriodScreen} />
            <Stack.Screen
              name="GroupRecommend"
              component={GroupRecommendScreen}
            />
            <Stack.Group screenLayout={topSafeAreaLayout}>
              <Stack.Screen name="Home" component={MainTabs} />
              <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
              <Stack.Screen
                name="GroupCreated"
                component={GroupCreatedScreen}
              />
              <Stack.Screen name="WaitingRoom" component={WaitingRoomScreen} />
              <Stack.Screen name="JoinByCode" component={JoinByCodeScreen} />
              <Stack.Screen
                name="JoinComplete"
                component={JoinCompleteScreen}
              />
              <Stack.Screen name="InviteGroup" component={InviteGroupScreen} />
              <Stack.Screen
                name="Verification"
                component={VerificationStartScreen}
              />
              <Stack.Screen name="Camera" component={CameraScreen} />
              <Stack.Screen name="Preview" component={PreviewScreen} />
              <Stack.Screen
                name="VerificationLoading"
                component={VerificationLoadingScreen}
              />
              <Stack.Screen
                name="VerificationResult"
                component={VerificationResultScreen}
              />
              <Stack.Screen
                name="RewardDetail"
                component={RewardDetailScreen}
              />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
              />
              <Stack.Screen name="Privacy" component={PrivacyScreen} />
              <Stack.Screen name="Terms" component={TermsScreen} />
              <Stack.Screen name="Support" component={SupportScreen} />
              <Stack.Screen name="Settings" component={SettingsScreen} />
              <Stack.Screen name="AiCoach" component={AiCoachScreen} />
              <Stack.Screen name="HeartEvent" component={HeartEventScreen} />
              <Stack.Screen name="Report" component={ReportScreen} />
              <Stack.Screen name="FullRanking" component={FullRankingScreen} />
              <Stack.Screen
                name="RankingCriteria"
                component={RankingCriteriaScreen}
              />
              <Stack.Screen name="GroupResult" component={GroupResultScreen} />
              <Stack.Screen
                name="GroupDetail"
                component={ExploreGroupDetailScreen}
              />
              <Stack.Screen
                name="InviteLanding"
                component={InviteLandingScreen}
              />
              <Stack.Screen name="DevHome" component={DevHomeScreen} />
              <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppStateProvider>
  );
}
