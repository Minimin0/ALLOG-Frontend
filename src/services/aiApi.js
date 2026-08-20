// aiApi service — AI 코치
// dev preview 엔드포인트(POST /api/v1/dev/ai-coach/preview)는 일반 배포에 존재하지 않으므로 쓰지 않는다.
import { apiRequest } from "./api";

// 200 항상 응답. provider 키가 없으면 generationType: "TEMPLATE"로 degrade된다(정상 동작).
// 404 = 그 그룹의 멤버가 아님.
export function fetchAiCoach(groupId, options) {
  return apiRequest(`/api/v1/groups/${groupId}/ai-coach`, options);
}

export function fetchAiCoachFollowUp(groupId, questionId, options) {
  return apiRequest(`/api/v1/groups/${groupId}/ai-coach/follow-up`, {
    ...options,
    method: "POST",
    body: { questionId },
  });
}
