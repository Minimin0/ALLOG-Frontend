import { ApiError, apiRequest } from './api';
import { setAccessToken } from './tokenStore';

async function authenticate(path, loginId, password) {
  const response = await apiRequest(path, {
    method: 'POST',
    body: { loginId: loginId.trim().toLowerCase(), password },
    skipAuth: true,
  });
  if (response.ok && typeof response.data?.accessToken === 'string') {
    await setAccessToken(response.data.accessToken);
    return response;
  }
  return response.ok ? { ...response, ok: false, errorCode: ApiError.UNKNOWN } : response;
}

export function signIn(loginId, password) {
  return authenticate('/api/v1/auth/login', loginId, password);
}

export function signUp(loginId, password) {
  return authenticate('/api/v1/auth/signup', loginId, password);
}

export function authErrorMessage(response) {
  if (response?.status === 401) return '아이디 또는 비밀번호가 올바르지 않아요.';
  if (response?.status === 429) return response?.data?.error?.code === 'SIGNUP_RATE_LIMITED'
    ? '회원가입 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.'
    : '로그인 시도가 너무 많아요. 잠시 후 다시 시도해 주세요.';
  if (response?.status === 409) return '이미 사용 중인 아이디예요.';
  if (response?.errorCode === ApiError.VALIDATION) return '아이디와 비밀번호 형식을 확인해 주세요.';
  if (response?.errorCode === ApiError.NETWORK || response?.errorCode === ApiError.SERVICE_UNAVAILABLE) {
    return '서버에 연결할 수 없어요. 잠시 후 다시 시도해 주세요.';
  }
  return response?.data?.error?.message || '인증에 실패했어요.';
}
