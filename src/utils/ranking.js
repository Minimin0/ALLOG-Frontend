// 랭킹 멤버 정렬 + 순위(rank) 부여 유틸.
// 그룹 랭킹 / 전체 랭킹 화면이 공통으로 사용한다.

/**
 * 멤버 목록을 score 내림차순으로 정렬하고 각 멤버에 rank를 부여한다.
 * @param {Array<{id: string, name: string, score: number}>} members
 * @returns {Array<{id, name, score, rank: number}>} rank가 추가된 새 배열
 */
export function rankMembers(members) {
  // 1) score 높은 순으로 정렬 (원본 불변)
  const sorted = [...members].sort((a, b) => b.score - a.score);

  // 2) 순위 부여 — 정책 B: 조밀 순위(1-2-2-3)
  //    동점(같은 score)은 같은 순위를 받고, 다음 순위는 건너뛰지 않는다.
  //    예) score [180,150,100,80,80] → rank [1,2,3,4,4]
  let rank = 0;
  let prevScore = null;
  return sorted.map((member) => {
    // 직전 멤버와 점수가 다를 때만 순위를 1 올린다 (같으면 rank 유지 = 동점)
    if (member.score !== prevScore) {
      rank += 1;
      prevScore = member.score;
    }
    return { ...member, rank };
  });
}
