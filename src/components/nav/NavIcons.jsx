import Svg, { Path, Circle } from 'react-native-svg';

// 하단 탭 아이콘 (웹 BottomNav의 인라인 SVG를 react-native-svg로 포팅).
// color/size prop을 받아 활성/비활성 색을 바꾼다.

export function GroupIcon({ color = '#111111', size = 24 }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1.8c-2.7 0-6.5 1.34-6.5 4V19H10v-2.2c0-1 .35-1.9.98-2.66C10.3 12.92 9.1 12.8 8 12.8zm8 0c-.3 0-.66.02-1.05.06.66.77 1.05 1.68 1.05 2.74V19h6.5v-2.2c0-2.66-3.8-4-6.5-4z" />
    </Svg>
  );
}

export function SearchIcon({ color = '#111111', size = 24 }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round">
      <Circle cx="11" cy="11" r="7" />
      <Path d="M20 20l-3.6-3.6" />
    </Svg>
  );
}

export function HomeIcon({ color = '#111111', size = 24 }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Path d="M12 3.2 2.6 11l1.4 1.6L5 11.7V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-8.3l1 .9L21.4 11 12 3.2z" />
    </Svg>
  );
}

export function GiftIcon({ color = '#111111', size = 24 }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Path d="M20 8h-2.5a2.5 2.5 0 1 0-4-3 2.5 2.5 0 1 0-4 3H4a1 1 0 0 0-1 1v2h8V9h2v2h8V9a1 1 0 0 0-1-1zM11 8H9.5a1 1 0 1 1 1-1c.28 0 .5.1.68.26L11 8zm3.5 0H13l-.18-.74A1 1 0 1 1 14.5 8zM4 13v6a1 1 0 0 0 1 1h6v-7H4zm9 7h6a1 1 0 0 0 1-1v-6h-7v7z" />
    </Svg>
  );
}

export function PersonIcon({ color = '#111111', size = 24 }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} fill={color}>
      <Circle cx="12" cy="8" r="4" />
      <Path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6v1H4v-1z" />
    </Svg>
  );
}
