// 공통 버튼. 화면마다 반복되던 알약형 버튼 스타일을 한 곳으로 모음.
// variant로 주요/보조/외곽선/위험 스타일을 고르고, disabled면 자동으로 비활성 색.
const VARIANTS = {
  primary: 'bg-primary text-white',
  secondary: 'bg-disabled text-white',
  outline: 'border border-line bg-transparent text-ink',
  danger: 'bg-danger text-white',
  dark: 'bg-ink text-white',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const pad = size === 'lg' ? 'py-4' : 'py-3';
  const base = `rounded-pill ${pad} text-body font-semibold transition active:scale-[0.99]`;
  const look = disabled ? 'bg-disabled text-white' : VARIANTS[variant];
  const width = fullWidth ? 'w-full' : 'px-6';

  return (
    <button type={type} disabled={disabled} className={`${base} ${width} ${look} ${className}`} {...rest}>
      {children}
    </button>
  );
}
