import '../global.css';

import { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/theme';

// 정식 Expo Router runtime에서 폰트가 준비될 때까지 첫 화면을 지킨다.
SplashScreen.preventAutoHideAsync();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [{ fontFamily: 'Pretendard' }, Text.defaultProps.style];
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = [{ fontFamily: 'Pretendard' }, TextInput.defaultProps.style];

// 앱 루트 레이아웃 (웹의 App.jsx + BrowserRouter 역할).
// Expo Router가 app/ 폴더의 파일을 경로로 매핑한다 (파일기반 라우팅).
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Pretendard: require('../mobile/assets/fonts/PretendardVariable.ttf'),
  });

  // SecureStore 세션을 앱 전체에서 한 번만 복구한다.
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
