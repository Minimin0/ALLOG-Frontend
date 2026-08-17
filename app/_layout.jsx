import '../global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAuthStore } from '@/stores/authStore';

// 앱 루트 레이아웃 (웹의 App.jsx + BrowserRouter 역할).
// Expo Router가 app/ 폴더의 파일을 경로로 매핑한다 (파일기반 라우팅).
export default function RootLayout() {
  // Firebase 세션 구독을 앱 전체에서 한 번만 시작한다. 앱을 다시 열어도 로그인이 유지된다.
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#f7f6f3' },
            animation: 'slide_from_right',
          }}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
