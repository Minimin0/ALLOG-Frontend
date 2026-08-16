// userApi service — 프로필 / 온보딩 / 통계
// 필드 이름과 enum casing은 docs/api/android-mvp-api-contract.md 기준.
// 프로필·온보딩 enum은 lower_snake_case (그룹 도메인의 UPPERCASE와 다르다).
import { apiRequest } from "./api";

// 200 = 기존 사용자 / 404 = 인증은 됐지만 온보딩 전 (에러가 아니라 온보딩 신호)
export function fetchMyProfile(options) {
  return apiRequest("/api/v1/users/me", options);
}

// 프로필+온보딩 생성. 백엔드가 같은 트랜잭션에서 하트 3개를 지급한다.
// 계약에 없는 key를 하나라도 보내면 400 UNKNOWN_FIELD이므로 절대 임의 필드를 넣지 않는다.
export function createMyProfile(body, options) {
  return apiRequest("/api/v1/users", { ...options, method: "POST", body });
}

export function updateMyProfile(body, options) {
  return apiRequest("/api/v1/users/me", { ...options, method: "PATCH", body });
}

// { hearts, rewardPoints, successfulRoutines }
export function fetchMyStats(options) {
  return apiRequest("/api/v1/users/me/stats", options);
}
