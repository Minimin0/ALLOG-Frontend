// api service — 공통 API 클라이언트
// ALLOG 백엔드 요청에 Firebase ID Token을 자동으로 Authorization 헤더에 실어 보냅니다.
import { getCurrentIdToken } from "./authApi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

/**
 * @param {string} path - 예: "/api/v1/me/groups/1/progress"
 * @param {object} options
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} [options.method]
 * @param {object} [options.body]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuth] - true면 Authorization 헤더를 아예 붙이지 않음 (토큰 없음 케이스 테스트용)
 * @param {string} [options.overrideToken] - 값을 주면 실제 토큰 대신 이 값을 사용 (잘못된 토큰 케이스 테스트용)
 */
export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {}, skipAuth = false, overrideToken } = options;

  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (!skipAuth) {
    const token = overrideToken !== undefined ? overrideToken : await getCurrentIdToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    return { ok: false, status: 0, data: null, error: error.message };
  }

  // 401 응답 등은 Content-Type/Body가 아예 없을 수 있으므로
  // response.json()을 무조건 호출하지 않고, 먼저 text로 읽은 뒤 비어있지 않을 때만 파싱합니다.
  let data = null;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = null;
  }

  return { ok: response.ok, status: response.status, data, error: null };
}

export default apiRequest;
