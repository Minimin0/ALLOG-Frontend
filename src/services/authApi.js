// authApi service — Firebase 인증 (React Native)
//
// signInWithPopup은 웹 전용 API라 RN에서 동작하지 않는다(그리고 이 파일이 import하던
// googleProvider는 firebase.js에 존재하지도 않았다). Google 로그인은 expo-auth-session과
// OAuth client id가 필요해서 이번 데드라인 안에서는 불가능하므로, RN에서 추가 의존성 없이
// 실제로 동작하는 최소 경로인 이메일/비밀번호를 사용한다. 발급되는 것은 Access Token이
// 아니라 백엔드가 검증하는 Firebase ID Token이다.
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";

const NOT_CONFIGURED_MESSAGE =
  "Firebase 환경변수(.env의 EXPO_PUBLIC_FIREBASE_*)가 아직 설정되지 않았어요.";

function requireAuth() {
  if (!isFirebaseConfigured || !auth) {
    throw new Error(NOT_CONFIGURED_MESSAGE);
  }
  return auth;
}

export function signIn(email, password) {
  return signInWithEmailAndPassword(requireAuth(), email.trim(), password);
}

export function signUp(email, password) {
  return createUserWithEmailAndPassword(requireAuth(), email.trim(), password);
}

export function signOutUser() {
  if (!isFirebaseConfigured || !auth) return Promise.resolve();
  return signOut(auth);
}

// 현재 로그인된 사용자의 Firebase ID Token 발급
// (Access Token / Google OAuth Token이 아니라 반드시 ID Token)
export async function getCurrentIdToken(forceRefresh = false) {
  if (!isFirebaseConfigured || !auth) return null;
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken(forceRefresh);
}

// 로그인 상태 변화 구독 (앱 재실행 시 로그인 유지 여부 확인)
export function subscribeToAuthChanges(callback) {
  if (!isFirebaseConfigured || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth ? auth.currentUser : null;
}

// Firebase가 던지는 코드는 사용자에게 보여줄 수 없으므로 화면에서 쓸 문구로 바꾼다.
export function authErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-email":
      return "이메일 형식이 올바르지 않아요.";
    case "auth/missing-password":
      return "비밀번호를 입력해주세요.";
    case "auth/weak-password":
      return "비밀번호는 6자 이상이어야 해요.";
    case "auth/email-already-in-use":
      return "이미 가입된 이메일이에요. 로그인해주세요.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    case "auth/too-many-requests":
      return "시도가 너무 많아요. 잠시 후 다시 시도해주세요.";
    case "auth/network-request-failed":
      return "네트워크에 연결할 수 없어요.";
    default:
      return error?.message || "로그인에 실패했어요.";
  }
}
