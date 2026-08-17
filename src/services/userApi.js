// userApi service
import { apiRequest } from "./api";

// 7B-2 검증용 보호 API — GET /api/v1/me/groups/{groupId}/progress
// groupId는 테스트 시 바뀔 수 있으므로 하드코딩하지 않고 인자로 받습니다.
export function fetchGroupProgress(groupId, options) {
  return apiRequest(`/api/v1/me/groups/${groupId}/progress`, options);
}
