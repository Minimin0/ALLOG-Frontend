import '../global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from '../mobile/src/state/AppState';

// 앱 루트 레이아웃 (웹의 App.jsx + BrowserRouter 역할).
// Expo Router가 app/ 폴더의 파일을 경로로 매핑한다 (파일기반 라우팅).
// AppStateProvider: MobileScreenRoute로 위임된 HW 화면들(닉네임/하트/포인트 등
// 전역 상태 사용)이 정상 동작하려면 필요 — 없으면 useAppState()가 null을 반환해 크래시남.
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppStateProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#f7f6f3' },
              animation: 'slide_from_right',
            }}
          />
        </AppStateProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
