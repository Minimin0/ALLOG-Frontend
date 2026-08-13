// userApi service
import { apiRequest } from "./api";

// 로그인 후 보호 API 호출 테스트용 — GET /api/v1/users/me
export function fetchMe(options) {
  return apiRequest("/api/v1/users/me", options);
}
