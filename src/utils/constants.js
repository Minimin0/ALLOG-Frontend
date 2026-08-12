// 앱 전역에서 쓰는 고정 상수 모음 (카테고리/상태/사유 등).

// 재인증 요청 사유 (다른 멤버의 인증을 재인증 요청할 때 — 피드 ⋯ 메뉴)
export const REVERIFY_REASONS = [
  { id: 'dup', label: '이전 인증과 동일한 사진 (중복 인증)' },
  { id: 'steal', label: '인터넷에서 가져온 사진 도용' },
  { id: 'unrelated', label: '인증 미션과 무관한 사진' },
  { id: 'fake', label: '합성 및 조작된 사진' },
  { id: 'etc', label: '기타' },
];

// 재인증 요청 · 인증 신고 사유
export const REPORT_REASONS = [
  { id: 'ai-verdict', label: 'AI 판정에 이의 있어요 (재인증 요청)' },
  { id: 'not-related', label: '루틴과 관련 없는 인증이에요' },
  { id: 'fake', label: '조작·도용된 인증 같아요' },
  { id: 'offensive', label: '부적절한 내용이 포함돼 있어요' },
  { id: 'etc', label: '기타' },
];
