// 서버 연결 전 테스트용 그룹/랭킹 데이터.
// breakdown = 점수 4요소의 달성률(각 0~1). utils/score.js의 calcScore로 총점 산출.
//   (나중에 서버가 이 요소값 또는 최종 점수를 내려주면 그대로 대체됨)
// isMe = 현재 로그인 사용자 본인 여부 ("나" 배지 표시용).
export const mockGroup = {
  id: 'g1',
  title: '하루 운동 30분',
  day: 5,
  totalMembers: 5,
  verifiedToday: 2,
  // 합산(챌린지 결과) 화면용
  period: '8.10~8.24',
  successRate: 87, // 그룹 공동 성공률(%)
  goalRate: 80, // 그룹 목표(%)
  // 정보 탭용
  inviteCode: '7XQK92',
  periodText: '8.10 ~ 8.24 (14일)',
  dday: 2, // 남은 기간 D-2
};

// 인증 성공 후 짧게 보여줄 패턴 피드백 (연속 성공 / 최근 자주 인증한 시간대).
// 실제로는 서버가 사용자 인증 이력으로 계산해 내려준다.
export const mockVerifyFeedback = {
  streak: 3, // 연속 성공 일수
  bestTime: '저녁 9시대', // 최근 자주 인증한 시간대
};

// 재인증 안내: "실패"만 알리지 않고 무엇이 확인되지 않았는지 + 다시 촬영하는 방법.
export const mockRetryGuide = {
  notConfirmed: ['운동 동작이 명확히 보이지 않았어요', '영상이 너무 짧았어요 (3초 미만)'],
  tips: ['전신이 화면에 들어오게 촬영해요', '동작을 3초 이상 이어서 담아요', '밝은 곳에서 흔들림 없이 찍어요'],
};

// 인증(피드) 탭용 멤버별 오늘 인증 현황.
// status: 'me'(내 미인증) | 'verified'(인증 완료) | 'waiting'(대기중)
export const mockFeed = [
  { id: 'u1', name: '나', status: 'me' },
  { id: 'u2', name: '민수', status: 'verified', timeAgo: '2시간 전', image: '/images/workout-verify.png' },
  { id: 'u3', name: '현지', status: 'verified', timeAgo: '5시간 전', image: '/images/workout-verify.png' },
  { id: 'u4', name: '지민', status: 'waiting' },
  { id: 'u5', name: '지현', status: 'waiting' },
];

// minutes = 누적 운동 시간(분) — 랭킹 탭 캡션·정렬 기준. breakdown = 점수(합산/보상)용.
export const mockGroupRanking = [
  { id: 'u1', name: '서준', isMe: true,  minutes: 180, breakdown: { personal: 1.0,  group: 0.9, streak: 0.95, contribution: 0.85 } },
  { id: 'u2', name: '민수', isMe: false, minutes: 150, breakdown: { personal: 0.9,  group: 0.8, streak: 0.8,  contribution: 0.7 } },
  { id: 'u3', name: '지민', isMe: false, minutes: 100, breakdown: { personal: 0.8,  group: 0.7, streak: 0.6,  contribution: 0.6 } },
  { id: 'u4', name: '지현', isMe: false, minutes: 80,  breakdown: { personal: 0.6,  group: 0.6, streak: 0.5,  contribution: 0.5 } },
  { id: 'u5', name: '현지', isMe: false, minutes: 60,  breakdown: { personal: 0.65, group: 0.5, streak: 0.55, contribution: 0.45 } },
];

// 전체(방 간 통합) 랭킹용 mock. score = 누적 포인트(서버가 최종값을 줄 항목).
// group = 소속 챌린지 이름(통합이라 어느 방인지 함께 표시). isMe = 본인.
export const mockFullRanking = [
  { id: 'g_a', name: '하윤', group: '하루 물 2L', score: 2380, isMe: false },
  { id: 'g_b', name: '도윤', group: '아침 독서 20분', score: 2210, isMe: false },
  { id: 'g_c', name: '민서', group: '하루 운동 30분', score: 2140, isMe: false },
  { id: 'u1', name: '서준', group: '하루 운동 30분', score: 1980, isMe: true },   // ┐ 동점(1980)
  { id: 'g_d', name: '지우', group: '미라클 모닝', score: 1980, isMe: false },     // ┘
  { id: 'g_e', name: '예은', group: '하루 명상 10분', score: 1750, isMe: false }, // 동점 다음 → 조밀 순위 5위
  { id: 'g_f', name: '준호', group: '계단 오르기', score: 1600, isMe: false },
];
