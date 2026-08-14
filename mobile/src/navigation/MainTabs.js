import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import HomeScreen from "../screens/main/HomeNative";
import ExploreScreen from "../screens/main/ExploreScreen";
import MyGroupScreen from "../screens/main/MyGroupNative";
import RewardScreen from "../screens/main/RewardScreen";
import MyScreen from "../screens/main/MyScreen";
import GroupIcon from "../../assets/images/GroupTab.svg";
import ExploreIcon from "../../assets/images/ExploreTab.svg";
import RewardIcon from "../../assets/images/RewardTab.svg";
import MyIcon from "../../assets/images/MyTab.svg";
const Tab = createBottomTabNavigator();
const icons = {
  Group: GroupIcon,
  Explore: ExploreIcon,
  Reward: RewardIcon,
  My: MyIcon,
};
export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: s.bar,
        tabBarLabelStyle: s.label,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#bababa",
        tabBarIcon: ({ color }) => {
          if (route.name === "HomeTab")
            return (
              <View
                style={[
                  s.home,
                  { backgroundColor: color === "#000" ? "#000" : "#bababa" },
                ]}
              >
                <Svg width={22} height={24} viewBox="188 20 32 34">
                  <Path
                    fill="#ffffff"
                    d="M193 47.975V33.4883C193 33.0617 193.096 32.6578 193.287 32.2767C193.478 31.8956 193.741 31.5817 194.077 31.335L203.052 24.5383C203.522 24.1794 204.058 24 204.662 24C205.265 24 205.805 24.1794 206.282 24.5383L215.257 31.3333C215.593 31.58 215.857 31.8944 216.047 32.2767C216.238 32.6578 216.333 33.0617 216.333 33.4883V47.975C216.333 48.4217 216.167 48.8111 215.835 49.1433C215.503 49.4756 215.113 49.6417 214.667 49.6417H209.027C208.644 49.6417 208.324 49.5128 208.067 49.255C207.809 48.9961 207.68 48.6761 207.68 48.295V40.3467C207.68 39.9656 207.551 39.6461 207.293 39.3883C207.034 39.1294 206.714 39H203C202.619 39 202.299 39.1294 202.042 39.3883C201.783 39.6461 201.653 39.9656 201.653 40.3467V48.2967C201.653 48.6778 201.524 48.9972 201.267 49.255C201.009 49.5128 200.689 49.6417 200.308 49.6417H194.667C194.22 49.6417 193.831 49.4756 193.498 49.1433C193.166 48.8111 193 48.4217 193 47.975Z"
                  />
                </Svg>
              </View>
            );
          const Icon = icons[route.name];
          return <Icon width={22} height={22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Group"
        component={MyGroupScreen}
        options={{ title: "내 그룹" }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ title: "탐색" }}
      />
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "홈", tabBarLabel: "" }}
      />
      <Tab.Screen
        name="Reward"
        component={RewardScreen}
        options={{ title: "리워드" }}
      />
      <Tab.Screen
        name="My"
        component={MyScreen}
        options={{ title: "마이 페이지" }}
      />
    </Tab.Navigator>
  );
}
const s = StyleSheet.create({
  bar: {
    height: 66,
    paddingTop: 7,
    paddingBottom: 7,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    elevation: 12,
  },
  label: { fontSize: 10, fontWeight: "700" },
  home: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
    borderWidth: 8,
    borderColor: "#fff",
  },
});
