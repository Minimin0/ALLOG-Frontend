import { Pressable, Text } from 'react-native';

// 공통 버튼 (RN 포팅). 웹 API(variant/size/fullWidth/disabled) 유지.
// 웹→RN: <button onClick> → <Pressable onPress>, 라벨은 반드시 <Text>로 감쌈.
const VARIANTS = {
  primary: { box: 'bg-primary', label: 'text-white' },
  secondary: { box: 'bg-disabled', label: 'text-white' },
  outline: { box: 'border border-line bg-transparent', label: 'text-ink' },
  danger: { box: 'bg-danger', label: 'text-white' },
  dark: { box: 'bg-ink', label: 'text-white' },
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  disabled = false,
  onPress,
  className = '',
  children,
}) {
  const pad = size === 'lg' ? 'py-4' : 'py-3';
  const look = disabled ? VARIANTS.secondary : VARIANTS[variant];
  const width = fullWidth ? 'w-full' : 'self-start px-6';

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      className={`items-center justify-center rounded-pill ${pad} ${width} ${look.box} ${
        disabled ? 'opacity-60' : 'active:opacity-90'
      } ${className}`}
    >
      <Text className={`text-[15px] font-semibold ${look.label}`}>{children}</Text>
    </Pressable>
  );
}
