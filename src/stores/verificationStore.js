import { create } from 'zustand';

// 인증 플로우 공유 상태 (RN). 녹화 결과 uri + AI 검토 결과.
// 웹판의 URL.createObjectURL/revokeObjectURL(브라우저 API)는 RN에 없어 파일 uri만 보관.
export const useVerificationStore = create((set) => ({
  media: null, // { uri, type: 'video' }
  result: null, // 'success' | 'retry'
  setMedia: (media) => set({ media }),
  setResult: (result) => set({ result }),
  reset: () => set({ media: null, result: null }),
}));
