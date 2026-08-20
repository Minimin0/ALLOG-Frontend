// verificationApi service — 인증(사진) 제출
// 흐름: POST current → POST upload-intent → 서명된 업로드 URL로 PUT → POST submit
// Gabia 로컬 미디어 저장소가 비활성 또는 미구성인 경우 upload-intent / submit은 503을 준다. 이는 예상된 운영 상태이지 버그가 아니다.
import { apiRequest, ApiError } from "./api";

// MVP에서 서버가 정제할 수 있는 타입은 사진 2종뿐. VIDEO / HEIC는 지원하지 않는다.
export const SUPPORTED_CONTENT_TYPES = ["image/jpeg", "image/png"];

function base(groupId) {
  return `/api/v1/me/groups/${groupId}/verifications/current`;
}

// GET이 아니라 POST다 — 오늘 슬롯이 없으면 만들어준다. 미디어 저장소가 비활성이어도 이 단계는 동작한다.
export function openTodayVerification(groupId, options) {
  return apiRequest(base(groupId), { ...options, method: "POST" });
}

export function requestUploadIntent(groupId, { contentType, sizeBytes }, options) {
  return apiRequest(`${base(groupId)}/upload-intent`, {
    ...options,
    method: "POST",
    body: { contentType, sizeBytes },
  });
}

export function submitVerification(groupId, options) {
  return apiRequest(`${base(groupId)}/submit`, { ...options, method: "POST" });
}

/**
 * 서명된 업로드 URL로 바이트를 직접 올린다. 백엔드가 돌려준 method/headers를 그대로 써야 한다.
 * 별도 업로드 endpoint로 가는 요청이므로 ALLOG Authorization 헤더를 붙이지 않는다.
 */
export async function uploadToPresignedUrl(intent, blob) {
  const headers = {};
  Object.entries(intent.requiredHeaders || {}).forEach(([key, value]) => {
    headers[key] = Array.isArray(value) ? value[0] : value;
  });

  try {
    const response = await fetch(intent.uploadUrl, {
      method: intent.method || "PUT",
      headers,
      body: blob,
    });
    return response.ok
      ? { ok: true, status: response.status, errorCode: null }
      : { ok: false, status: response.status, errorCode: ApiError.UNKNOWN };
  } catch (error) {
    return { ok: false, status: 0, errorCode: ApiError.NETWORK };
  }
}

/**
 * 사진 하나를 인증으로 제출하는 전체 절차. 어느 단계에서 막혔는지 호출부가 알 수 있도록
 * 실패한 단계와 errorCode를 함께 돌려준다.
 * @param {string} fileUri - expo-camera가 준 로컬 파일 URI
 */
export async function submitPhotoVerification(groupId, fileUri, contentType = "image/jpeg") {
  const opened = await openTodayVerification(groupId);
  if (!opened.ok) return { ok: false, step: "open", errorCode: opened.errorCode };

  let blob;
  try {
    blob = await (await fetch(fileUri)).blob();
  } catch (error) {
    return { ok: false, step: "read", errorCode: ApiError.UNKNOWN };
  }

  const intent = await requestUploadIntent(groupId, { contentType, sizeBytes: blob.size });
  if (!intent.ok) return { ok: false, step: "upload-intent", errorCode: intent.errorCode };

  const uploaded = await uploadToPresignedUrl(intent.data, blob);
  if (!uploaded.ok) return { ok: false, step: "upload", errorCode: uploaded.errorCode };

  const submitted = await submitVerification(groupId);
  if (!submitted.ok) return { ok: false, step: "submit", errorCode: submitted.errorCode };

  return { ok: true, step: "submit", errorCode: null, data: submitted.data };
}
