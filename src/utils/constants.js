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

export const COACH_STYLES = [
  {
    name: "응원형",
    tone: "따뜻하게 격려해드려요",
    image: "/images/응원형.svg",
  },
  {
    name: "압박형",
    tone: "긴장감 있게 자극할게요",
    image: "/images/압박형.svg",
  },
  {
    name: "팩트형",
    tone: "숫자와 근거로 말할게요",
    image: "/images/팩트형.svg",
  },
  {
    name: "유머형",
    tone: "가볍고 재밌게 말할게요",
    image: "/images/유머형.svg",
  },
];

export const DEFAULT_COACH_STYLE = COACH_STYLES[0].name;

export function getCoachStyleImage(name) {
  return (
    COACH_STYLES.find((style) => style.name === name)?.image ??
    COACH_STYLES[0].image
  );
}

export function getCoachStyleTone(name) {
  return (
    COACH_STYLES.find((style) => style.name === name)?.tone ??
    COACH_STYLES[0].tone
  );
}
