import { Text } from 'react-native';

// 입력값 유효성 안내 문구 — 앱 전역에서 통일된 디자인(작은 빨간 텍스트)으로 사용.
export default function FieldError({ children }) {
  if (!children) return null;
  return <Text className="mt-1.5 text-[11px] font-semibold text-danger">{children}</Text>;
}
