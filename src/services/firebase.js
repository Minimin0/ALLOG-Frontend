import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase 초기화 (RN). 값은 .env의 EXPO_PUBLIC_FIREBASE_* 에서 읽는다.
// 웹판(import.meta.env.VITE_*) → RN판(process.env.EXPO_PUBLIC_*)으로 이관.
// 키가 없으면 initializeApp을 호출하지 않아 앱이 죽지 않도록 방어한다.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingKeys.length === 0;

let app = null;
let auth = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  // RN은 getAuth 대신 initializeAuth + AsyncStorage 영속성 사용.
  auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} else {
  // eslint-disable-next-line no-console
  console.warn(
    `[firebase] 다음 환경변수가 비어 있습니다: ${missingKeys.join(', ')}. .env에 EXPO_PUBLIC_FIREBASE_* 값을 채우기 전까지 Firebase 로그인은 비활성 상태예요.`,
  );
}

export { auth };
export default app;
