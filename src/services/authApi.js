// authApi service — Firebase Google 로그인 전용 (7B-2 Release Gate 검증용)
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./firebase";

const NOT_CONFIGURED_MESSAGE =
  "Firebase 환경변수(.env의 VITE_FIREBASE_*)가 아직 설정되지 않았어요.";

// Google 로그인 → 성공 시 firebase User 객체를 담은 UserCredential 반환
export function signInWithGoogle() {
  if (!isFirebaseConfigured) {
    return Promise.reject(new Error(NOT_CONFIGURED_MESSAGE));
  }
  return signInWithPopup(auth, googleProvider);
}

// 로그아웃
export function signOutUser() {
  if (!isFirebaseConfigured) return Promise.resolve();
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

// 로그인 상태 변화 구독 (예: 새로고침 시 로그인 유지 여부 확인)
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
