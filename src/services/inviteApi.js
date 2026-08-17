// inviteApi service — 비공개 그룹 초대 코드
// 비공개 그룹은 절대 공개 join(POST /groups/{id}/join)으로 우회하지 않는다. 백엔드가 409로 막는다.
import { apiRequest } from "./api";

// 방장이 코드 발급 → 200 { code }. 404 = 내 그룹이 아님 / 409 = PRIVATE 그룹이 아님
export function issueInviteCode(groupId, options) {
  return apiRequest(`/api/v1/me/groups/${groupId}/invite`, { ...options, method: "POST" });
}

// 코드로 참가 → 204. 공개 참가와 동일하게 하트 1개를 쓴다.
export function joinByInviteCode(code, options) {
  return apiRequest("/api/v1/groups/join-by-invite", {
    ...options,
    method: "POST",
    body: { code },
  });
}
