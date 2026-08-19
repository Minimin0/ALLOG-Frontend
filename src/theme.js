// ALLOG 디자인 토큰의 JS 단일 진실 공급원.
// className으로 색을 쓸 땐 tailwind.config.js의 토큰 클래스(bg-primary 등)를 쓰고,
// className을 못 쓰는 자리(ActivityIndicator color, placeholderTextColor, react-native-svg
// stroke/fill, StyleSheet)에서만 여기 값을 import 한다.
// 값을 바꾸면 tailwind.config.js와 같이 고친다. variables.css는 runtime에 import되지 않는 참고 팔레트다.
export const colors = {
  bg: "#f7f6f3",
  surface: "#fefefe",
  surfaceAlt: "#eae9e7",
  ink: "#111111",
  muted: "#6b7268",
  subtle: "#4a4a4a",
  disabled: "#bababa",
  line: "#e7e3d8",
  primary: "#14453a",
  primaryDark: "#0e3229",
  primaryTint: "#edf2ec",
  primaryPale: "#eaf4ec",
  reward: "#c08a24",
  rewardTint: "#f7f1e0",
  danger: "#c0492f",
  heart: "#d9573b", // 하트 잔량·소모 안내 (기존 화면들이 쓰던 값)
  spinner: "#4b7f63", // ActivityIndicator 기본색 (기존 화면들이 쓰던 값)
  primaryLight: "#669884", // 연한 브랜드 그린 — 진행률 강조
  mintBadge: "#e5f4e8", // 밝은 민트 — 배지 배경·어두운 버튼 위 텍스트
  beigeIcon: "#f3efe4", // 베이지 — 아이콘 원형 배경
  grayBtn: "#f0eee8", // 연회색 — 보조 버튼 배경
  grayBorder: "#d9d9d9", // 회색 — 입력 테두리·스위치 off 트랙·구분선
  // line과 값은 같지만 역할이 다르다. 어두운 배경 위 텍스트 전용이라
  // 테두리색(line)을 조정해도 이 색은 따라 움직이지 않아야 한다.
  onDark: "#e7e3d8",
  rankGold: "#f6b424",
  rankSilver: "#bababa",
  rankBronze: "#cba04d",
  white: "#ffffff",
  black: "#000000",
};

export const radius = { card: 24, item: 15, pill: 9999 };
export const font = {
  display: 28,
  h2: 22,
  score: 25,
  section: 17,
  body: 15,
  label: 12,
  caption: 11,
  nav: 10,
};
export const layout = { designWidth: 393, contentPadding: 30 };
