// groupApi service — 탐색 / 생성 / 참가 / 내 그룹 / 탈퇴·취소 / 진행률
// 그룹 도메인 enum은 UPPERCASE (RECRUITING, ACTIVE, PUBLIC …).
// 하트 차감·환급은 전부 백엔드가 한다. 여기서 계산하거나 낙관적으로 감소시키지 않는다.
import { apiRequest } from "./api";

// 그룹 생성 시 보낼 routineDefinitionId를 고르기 위한 목록.
export function fetchRoutineCatalog(options) {
  return apiRequest("/api/v1/routines", options);
}

// PUBLIC + RECRUITING만, 최신순, 페이지네이션 없음 — 필터는 백엔드가 authoritative.
export function fetchPublicGroups(options) {
  return apiRequest("/api/v1/groups", options);
}

// 201 → { groupId }. 생성자는 OWNER로 참가하며 하트 1개를 쓴다.
export function createGroup(body, options) {
  return apiRequest("/api/v1/me/groups", { ...options, method: "POST", body });
}

// 204 = 참가 완료(마지막 자리면 그룹이 같은 트랜잭션에서 시작됨)
// 409 + INSUFFICIENT_HEARTS = 하트 부족 / 409 (body 없음) = 이미 참가·정원초과·비공개 등
export function joinGroup(groupId, options) {
  return apiRequest(`/api/v1/groups/${groupId}/join`, { ...options, method: "POST" });
}

export function fetchMyGroups({ page = 0, size = 20 } = {}, options) {
  return apiRequest(`/api/v1/me/groups?page=${page}&size=${size}`, options);
}

// 멤버가 아니면 404 (비공개 그룹은 존재 자체가 노출되지 않는다)
export function fetchMyGroupDetail(groupId, options) {
  return apiRequest(`/api/v1/me/groups/${groupId}`, options);
}

// 멤버가 시작 전에 나가기. 반복 호출은 204 no-op.
export function leaveGroup(groupId, options) {
  return apiRequest(`/api/v1/groups/${groupId}/leave`, { ...options, method: "POST" });
}

// 방장이 시작 전에 그룹 닫기. 반복 호출은 204 no-op.
export function cancelGroup(groupId, options) {
  return apiRequest(`/api/v1/me/groups/${groupId}/cancel`, { ...options, method: "POST" });
}

// ACTIVE가 아니면 personal / group이 null이다. 화면은 null-safe여야 한다.
export function fetchGroupProgress(groupId, options) {
  return apiRequest(`/api/v1/me/groups/${groupId}/progress`, options);
}
