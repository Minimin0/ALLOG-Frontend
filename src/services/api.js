// api service — 공통 API 클라이언트
// ALLOG 백엔드 요청에 Firebase ID Token을 자동으로 Authorization 헤더에 실어 보냅니다.
// Expo(RN)에서는 import.meta가 없으므로 EXPO_PUBLIC_* 환경변수를 사용합니다.
import { getCurrentIdToken } from "./authApi";

export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

// 화면이 분기해야 하는 최소 단위. 백엔드는 같은 409를 body 있이/없이 모두 보내므로
// INSUFFICIENT_HEARTS와 그 밖의 CONFLICT를 반드시 다른 케이스로 취급합니다.
export const ApiError = {
  NETWORK: "NETWORK_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  INSUFFICIENT_HEARTS: "INSUFFICIENT_HEARTS",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  VALIDATION: "VALIDATION_ERROR",
  UNKNOWN: "UNKNOWN",
};

// 백엔드 에러 body는 두 가지 모양이 공존한다.
//   { "code": "INSUFFICIENT_HEARTS" }              ← 그룹 참가/생성 409
//   { "error": { "code": "...", "message": ... } } ← 프로필/통계
function backendCode(data) {
  if (!data || typeof data !== "object") return null;
  return data.code ?? data.error?.code ?? null;
}

function classify(status, data) {
  if (status === 0) return ApiError.NETWORK;
  if (status === 401) return ApiError.UNAUTHORIZED;
  if (status === 404) return ApiError.NOT_FOUND;
  if (status === 409) {
    return backendCode(data) === "INSUFFICIENT_HEARTS" ? ApiError.INSUFFICIENT_HEARTS : ApiError.CONFLICT;
  }
  if (status === 503) return ApiError.SERVICE_UNAVAILABLE;
  if (status === 400 || status === 413 || status === 415) return ApiError.VALIDATION;
  return ApiError.UNKNOWN;
}

/**
 * @returns {Promise<{ok: boolean, status: number, data: any, errorCode: string|null}>}
 *   ok=true면 errorCode는 null. 예외를 던지지 않으므로 호출부는 항상 결과를 분기하면 됩니다.
 *
 * @param {string} path - 예: "/api/v1/me/groups/1/progress"
 * @param {object} options
 * @param {"GET"|"POST"|"PUT"|"PATCH"|"DELETE"} [options.method]
 * @param {object} [options.body]
 * @param {object} [options.headers]
 * @param {boolean} [options.skipAuth] - true면 Authorization 헤더를 아예 붙이지 않음 (토큰 없음 케이스 테스트용)
 * @param {string} [options.overrideToken] - 값을 주면 실제 토큰 대신 이 값을 사용 (잘못된 토큰 케이스 테스트용)
 */
export async function apiRequest(path, options = {}) {
  if (!BASE_URL) return { ok: false, status: 0, data: null, errorCode: ApiError.NETWORK };
  const { method = "GET", body, headers = {}, skipAuth = false, overrideToken, _getToken = getCurrentIdToken, _hasRetriedAuth = false } = options;

  const finalHeaders = { "Content-Type": "application/json", ...headers };

  if (!skipAuth) {
    const token = overrideToken !== undefined ? overrideToken : await _getToken();
    // 토큰 값은 절대 로그에 남기지 않는다.
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
    return { ok: false, status: 0, data: null, errorCode: ApiError.NETWORK };
  }

  // 204/401/409는 body가 아예 없을 수 있으므로 response.json()을 무조건 호출하지 않고,
  // 먼저 text로 읽은 뒤 비어있지 않을 때만 파싱합니다.
  let data = null;
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = null;
  }

  if (response.status === 401 && !skipAuth && overrideToken === undefined && !_hasRetriedAuth) {
    let refreshedToken;
    try {
      refreshedToken = await _getToken(true);
    } catch (error) {
      refreshedToken = null;
    }
    return apiRequest(path, { ...options, overrideToken: refreshedToken, _getToken, _hasRetriedAuth: true });
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
    errorCode: response.ok ? null : classify(response.status, data),
  };
}

export default apiRequest;
