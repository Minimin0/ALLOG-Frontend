import { create } from 'zustand';

// 인증 촬영 플로우(촬영→미리보기→분석→결과) 동안 촬영 결과와 판정을 공유하는 스토어.
// 사진/영상 blob은 크기가 커서 라우터 state 대신 스토어로 전달한다.
export const useVerificationStore = create((set, get) => ({
  media: null, // { url: string(objectURL), file: File, type: string }
  result: null, // 'success' | 'retry' (AI/서버 1차 검토 결과)

  setMedia: (media) => set({ media }),
  setResult: (result) => set({ result }),

  // objectURL 메모리 해제까지 포함한 초기화 (다시 찍기 / 플로우 재시작 시)
  reset: () => {
    const current = get().media;
    if (current?.url) URL.revokeObjectURL(current.url);
    set({ media: null, result: null });
  },
}));
