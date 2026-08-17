// authStore — Firebase 세션 + 백엔드 프로필 부트스트랩
//
// 로그인 성공 후 GET /api/v1/users/me 한 번으로 갈 곳이 정해진다.
//   200 → 기존 사용자        → 메인
//   404 → 인증은 됐지만 온보딩 전 → 온보딩 (에러 아님)
//   401 → 세션/인증 문제
import { create } from "zustand";

import { ApiError } from "../services/api";
import { signOutUser, subscribeToAuthChanges } from "../services/authApi";
import { isFirebaseConfigured } from "../services/firebase";
import { useUserStore } from "./userStore";

export const AuthStatus = {
  LOADING: "loading", // 부트스트랩 진행 중
  SIGNED_OUT: "signedOut", // Firebase 사용자 없음
  ONBOARDING: "onboarding", // 인증됨 + 프로필 없음 (404)
  READY: "ready", // 인증됨 + 프로필 있음
  ERROR: "error", // 401 / 네트워크 등
};

export const useAuthStore = create((set, get) => ({
  status: AuthStatus.LOADING,
  firebaseUser: null,
  errorCode: null,
  unsubscribe: null,

  // 앱 시작 시 한 번. Firebase 미설정이면 SIGNED_OUT으로 두고 앱은 계속 살아 있게 한다.
  init: () => {
    if (get().unsubscribe) return;
    if (!isFirebaseConfigured) {
      set({ status: AuthStatus.SIGNED_OUT, firebaseUser: null });
      return;
    }

    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (!user) {
        useUserStore.getState().reset();
        set({ status: AuthStatus.SIGNED_OUT, firebaseUser: null, errorCode: null });
        return;
      }
      set({ firebaseUser: user, status: AuthStatus.LOADING, errorCode: null });
      await get().bootstrap();
    });
    set({ unsubscribe });
  },

  // GET /users/me 한 번으로 온보딩 여부를 판정한다.
  bootstrap: async () => {
    const response = await useUserStore.getState().loadProfile();
    if (response.ok) {
      set({ status: AuthStatus.READY, errorCode: null });
      return response;
    }
    if (response.errorCode === ApiError.NOT_FOUND) {
      set({ status: AuthStatus.ONBOARDING, errorCode: null });
      return response;
    }
    set({ status: AuthStatus.ERROR, errorCode: response.errorCode });
    return response;
  },

  // 온보딩 완료 직후 재조회 없이 상태만 올린다.
  markReady: () => set({ status: AuthStatus.READY, errorCode: null }),

  signOut: async () => {
    await signOutUser();
    useUserStore.getState().reset();
    set({ status: AuthStatus.SIGNED_OUT, firebaseUser: null, errorCode: null });
  },
}));

export default useAuthStore;
