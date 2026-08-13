// Firebase 앱 초기화 (Google 로그인 전용, 7B-2 Release Gate 검증용)
// 필요한 값은 .env(VITE_FIREBASE_*)에서 읽어옵니다. 절대 하드코딩하지 마세요.
// Service Account / Admin Credential은 여기 포함하지 않습니다 (백엔드 전용).
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingKeys.length === 0;

let app = null;
let auth = null;
let googleProvider = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} else {
  // .env에 값이 채워지기 전까지는 콘솔 경고만 띄우고 앱 전체가 죽지 않도록 합니다.
  // (getAuth()는 apiKey가 비어있으면 즉시 예외를 던지므로 여기서 호출하지 않습니다.)
  // eslint-disable-next-line no-console
  console.warn(
    `[firebase] 다음 환경변수가 비어 있습니다: ${missingKeys.join(", ")}. .env에 VITE_FIREBASE_* 값을 채우기 전까지 Firebase 로그인은 비활성 상태예요.`,
  );
}

export { auth, googleProvider };
export default app;
