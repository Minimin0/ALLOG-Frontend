// groupStore — 내 그룹 목록 / 현재 그룹 상세 / 진행률
// 홈·그룹·인증 화면이 같은 "지금 참여 중인 그룹"을 봐야 하므로 한 곳에서 들고 있는다.
import { create } from "zustand";

import { fetchGroupProgress, fetchMyGroupDetail, fetchMyGroups } from "../services/groupApi";

// 지금 화면에 띄울 그룹: 진행 중인 것 우선, 없으면 모집 중인 것, 그것도 없으면 첫 번째.
export function pickCurrentGroup(items = []) {
  return (
    items.find((g) => g.groupStatus === "ACTIVE") ??
    items.find((g) => g.groupStatus === "RECRUITING" || g.groupStatus === "FULL") ??
    items[0] ??
    null
  );
}

export const useGroupStore = create((set, get) => ({
  myGroups: [],
  myGroupsLoading: false,
  myGroupsError: null,

  detail: null,
  progress: null,
  detailLoading: false,
  detailError: null,

  loadMyGroups: async () => {
    set({ myGroupsLoading: true, myGroupsError: null });
    const response = await fetchMyGroups({ page: 0, size: 20 });
    set({
      myGroups: response.ok ? response.data?.items ?? [] : [],
      myGroupsLoading: false,
      myGroupsError: response.ok ? null : response.errorCode,
    });
    return response;
  },

  // 상세와 진행률은 같은 화면에서 함께 쓰이므로 한 번에 읽는다.
  loadGroup: async (groupId) => {
    set({ detailLoading: true, detailError: null });
    const [detail, progress] = await Promise.all([
      fetchMyGroupDetail(groupId),
      fetchGroupProgress(groupId),
    ]);
    set({
      detail: detail.ok ? detail.data : null,
      // ACTIVE가 아니면 personal/group이 null로 온다. 그 자체가 정상 응답이다.
      progress: progress.ok ? progress.data : null,
      detailLoading: false,
      detailError: detail.ok ? null : detail.errorCode,
    });
    return { detail, progress };
  },

  currentGroup: () => pickCurrentGroup(get().myGroups),

  reset: () => set({ myGroups: [], detail: null, progress: null, myGroupsError: null, detailError: null }),
}));

export default useGroupStore;
