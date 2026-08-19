// 평가 점수 계산 (기획서 §13-2: 개인35 + 그룹25 + 연속20 + 기여20 = 100)
//
// ⚠️ 백엔드와의 계약: 아래 가중치는 서버 계산식과 반드시 일치해야 한다.
//    최종 점수는 원칙상 서버가 계산해 전송하지만, 이 함수는
//    "4개 요소(각 0~1 달성률)를 받아 가중 합산"하는 순수 함수라
//    (1) 지금은 mock으로 프론트 계산, (2) 나중엔 서버가 준 요소값 표시에 그대로 재사용된다.

/**
 * 점수 항목 정의. 평가 기준 화면(RankingCriteriaPage)이 이걸 그대로 읽어 렌더한다.
 * → 화면에 35/25/20/20을 하드코딩하지 않기 위함 (여기만 고치면 화면도 바뀜).
 */
export const SCORE_WEIGHTS = [
  {
    key: 'personal',
    label: '개인 루틴 달성률',
    weight: 35,
    desc: '개인 유효 인증 완료 횟수 ÷ 개인 전체 루틴 횟수',
  },
  {
    key: 'group',
    label: '그룹 공동 달성률',
    weight: 25,
    desc: '그룹 전체 유효 인증 완료 횟수 ÷ 그룹 전체 목표 루틴 횟수',
  },
  {
    key: 'streak',
    label: '연속 성공률',
    weight: 20,
    desc: '개인 최장 연속 루틴 달성 일수 ÷ 챌린지 전체 기간',
  },
  {
    key: 'contribution',
    label: '그룹 기여도',
    weight: 20,
    desc: '동료 응원 및 그룹 체크인·공동 목표 활동 참여',
  },
];

/**
 * 4개 요소의 달성률(0~1)을 가중 합산해 0~100 점수를 낸다.
 * @param {{personal?: number, group?: number, streak?: number, contribution?: number}} ratios
 *        각 값은 0~1 (예: 개인 성과 30/35 달성 → personal: 0.857). 없으면 0으로 처리.
 * @returns {{ total: number, parts: Array<{key, label, weight, earned}> }}
 *          total = 반올림된 총점(0~100), parts = 항목별 획득 점수(earned).
 */
export function calcScore(ratios = {}) {
  const parts = SCORE_WEIGHTS.map((item) => {
    const ratio = clamp01(ratios[item.key] ?? 0);
    return { ...item, earned: Math.round(item.weight * ratio) };
  });
  const total = clamp(
    parts.reduce((sum, p) => sum + p.earned, 0),
    0,
    100
  );
  return { total, parts };
}

// 점수 → 보상 포인트 환산 (임시 규칙, 실제 보상표는 기획서/서버에서 확정)
export const rewardFromScore = (score) => score * 20;

function clamp01(n) {
  return clamp(Number(n) || 0, 0, 1);
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
