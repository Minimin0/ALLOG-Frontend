import '../global.css';

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider } from '../mobile/src/state/AppState';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.style = [{ fontFamily: 'Pretendard' }, Text.defaultProps.style];
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.style = [{ fontFamily: 'Pretendard' }, TextInput.defaultProps.style];

// 앱 루트 레이아웃 (웹의 App.jsx + BrowserRouter 역할).
// Expo Router가 app/ 폴더의 파일을 경로로 매핑한다 (파일기반 라우팅).
// AppStateProvider: MobileScreenRoute로 위임된 HW 화면들(닉네임/하트/포인트 등
// 전역 상태 사용)이 정상 동작하려면 필요 — 없으면 useAppState()가 null을 반환해 크래시남.
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Pretendard: require('../mobile/assets/fonts/PretendardVariable.ttf'),
  });
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppStateProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" backgroundColor="#f7f6f3" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#f7f6f3' },
              animation: 'fade',
            }}
          />
        </SafeAreaProvider>
      </AppStateProvider>
    </GestureHandlerRootView>
  );
}
