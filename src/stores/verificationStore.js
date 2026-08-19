import { create } from 'zustand';

// 인증 플로우 공유 상태. videoUri는 preview 전용의 transient cache URI이고,
// media는 백엔드 signed PUT에 전달될 JPEG artifact다. 판정 authority는 백엔드다.
export const useVerificationStore = create((set) => ({
  groupId: null,
  videoUri: null,
  media: null, // { uri, type: 'frame', contentType: 'image/jpeg' }
  outcome: null, // { state: 'submitted'|'unavailable'|'failed', step, errorCode }
  setGroupId: (groupId) => set({ groupId }),
  setCapture: ({ videoUri, media }) => set({ videoUri, media, outcome: null }),
  clearVideo: () => set({ videoUri: null }),
  setOutcome: (outcome) => set({ outcome }),
  reset: () => set({ videoUri: null, media: null, outcome: null }),
}));

export default useVerificationStore;
