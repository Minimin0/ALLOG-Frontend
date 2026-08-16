// userStore — 프로필/통계 캐시
// 여기 값은 표시용 캐시일 뿐 business truth가 아니다. 하트·포인트의 authority는 백엔드다.
import { create } from "zustand";

import { ApiError } from "../services/api";
import { createMyProfile, fetchMyProfile, fetchMyStats } from "../services/userApi";

export const useUserStore = create((set) => ({
  profile: null,
  stats: null,
  statsLoading: false,
  statsError: null,

  setProfile: (profile) => set({ profile }),

  // 404는 에러가 아니라 "온보딩 필요" 신호다. 호출부가 구분할 수 있게 errorCode를 그대로 넘긴다.
  loadProfile: async () => {
    const response = await fetchMyProfile();
    if (response.ok) set({ profile: response.data });
    return response;
  },

  createProfile: async (body) => {
    const response = await createMyProfile(body);
    if (response.ok) set({ profile: response.data });
    return response;
  },

  loadStats: async () => {
    set({ statsLoading: true, statsError: null });
    const response = await fetchMyStats();
    set({
      stats: response.ok ? response.data : null,
      statsLoading: false,
      statsError: response.ok ? null : response.errorCode,
    });
    return response;
  },

  reset: () => set({ profile: null, stats: null, statsLoading: false, statsError: null }),
}));

export const isProfileMissing = (response) =>
  !response.ok && response.errorCode === ApiError.NOT_FOUND;

export default useUserStore;
