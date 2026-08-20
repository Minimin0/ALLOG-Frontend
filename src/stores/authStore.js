import { create } from 'zustand';

import { ApiError } from '../services/api';
import { signIn, signUp } from '../services/authApi';
import { clearAccessToken, getAccessToken, onUnauthorized } from '../services/tokenStore';
import { useUserStore } from './userStore';

export const AuthStatus = {
  LOADING: 'loading',
  SIGNED_OUT: 'signedOut',
  ONBOARDING: 'onboarding',
  READY: 'ready',
  ERROR_RETRYABLE: 'errorRetryable',
  AUTH_ERROR: 'authError',
};

export function authBootstrapErrorMessage(errorCode) {
  if (errorCode === ApiError.UNAUTHORIZED) return '로그인 세션이 만료됐어요. 다시 로그인해 주세요.';
  if (errorCode === ApiError.NETWORK || errorCode === ApiError.SERVICE_UNAVAILABLE) {
    return '서버에 연결하지 못했어요. 다시 시도해 주세요.';
  }
  return '로그인 정보를 불러오지 못했어요. 다시 시도해 주세요.';
}

export const useAuthStore = create((set, get) => ({
  status: AuthStatus.LOADING,
  hasSession: false,
  errorCode: null,
  initialized: false,
  authPromise: null,

  init: async () => {
    if (get().initialized) return;
    set({ initialized: true, status: AuthStatus.LOADING, errorCode: null });
    onUnauthorized(() => {
      useUserStore.getState().reset();
      set({ status: AuthStatus.SIGNED_OUT, hasSession: false, errorCode: ApiError.UNAUTHORIZED });
    });
    try {
      const token = await getAccessToken();
      if (!token) {
        set({ status: AuthStatus.SIGNED_OUT, hasSession: false, errorCode: null });
        return;
      }
      set({ hasSession: true });
      await get().bootstrap();
    } catch {
      set({ status: AuthStatus.ERROR_RETRYABLE, hasSession: false, errorCode: ApiError.NETWORK });
    }
  },

  bootstrap: async () => {
    set({ status: AuthStatus.LOADING, errorCode: null });
    try {
      const response = await useUserStore.getState().loadProfile();
      if (response.ok) {
        set({ status: AuthStatus.READY, hasSession: true, errorCode: null });
      } else if (response.errorCode === ApiError.NOT_FOUND) {
        set({ status: AuthStatus.ONBOARDING, hasSession: true, errorCode: null });
      } else if (response.errorCode === ApiError.UNAUTHORIZED) {
        await clearAccessToken();
        useUserStore.getState().reset();
        set({ status: AuthStatus.SIGNED_OUT, hasSession: false, errorCode: ApiError.UNAUTHORIZED });
      } else {
        set({ status: AuthStatus.ERROR_RETRYABLE, errorCode: response.errorCode });
      }
      return response;
    } catch {
      const response = { ok: false, status: 0, data: null, errorCode: ApiError.NETWORK };
      set({ status: AuthStatus.ERROR_RETRYABLE, errorCode: response.errorCode });
      return response;
    }
  },

  authenticate: async (request) => {
    if (get().authPromise) return get().authPromise;
    const promise = (async () => {
      set({ status: AuthStatus.LOADING, errorCode: null });
      try {
        const response = await request();
        if (!response.ok) {
          set({ status: AuthStatus.AUTH_ERROR, hasSession: false, errorCode: response.errorCode });
          return response;
        }
        set({ hasSession: true });
        return get().bootstrap();
      } catch {
        const response = { ok: false, status: 0, data: null, errorCode: ApiError.NETWORK };
        set({ status: AuthStatus.ERROR_RETRYABLE, hasSession: false, errorCode: response.errorCode });
        return response;
      } finally {
        set({ authPromise: null });
      }
    })();
    set({ authPromise: promise });
    return promise;
  },

  signIn: (loginId, password) => get().authenticate(() => signIn(loginId, password)),
  signUp: (loginId, password) => get().authenticate(() => signUp(loginId, password)),
  markReady: () => set({ status: AuthStatus.READY, hasSession: true, errorCode: null }),

  signOut: async () => {
    await clearAccessToken();
    useUserStore.getState().reset();
    set({ status: AuthStatus.SIGNED_OUT, hasSession: false, errorCode: null });
  },
}));

export default useAuthStore;
