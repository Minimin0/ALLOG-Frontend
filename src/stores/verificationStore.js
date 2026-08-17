import { create } from 'zustand';

// 인증 플로우 공유 상태 (RN). 촬영 결과 uri + 백엔드 제출 결과.
// 백엔드가 정제할 수 있는 타입은 사진(image/jpeg, image/png)뿐이라 동영상은 다루지 않는다.
// 판정 authority는 백엔드다 — 여기 값은 화면 전환용이며 성공/실패를 프론트가 정하지 않는다.
export const useVerificationStore = create((set) => ({
  groupId: null,
  media: null, // { uri, type: 'photo', contentType }
  outcome: null, // { state: 'submitted'|'unavailable'|'failed', step, errorCode }
  setGroupId: (groupId) => set({ groupId }),
  setMedia: (media) => set({ media }),
  setOutcome: (outcome) => set({ outcome }),
  reset: () => set({ media: null, outcome: null }),
}));

export default useVerificationStore;
