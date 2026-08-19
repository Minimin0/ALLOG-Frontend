// ALLOG 마스코트(새싹 캐릭터). 새싹이 밑동을 축으로 살랑살랑 흔들린다.
// - 애니메이션 keyframe(sprout-sway / char-breathe)은 tailwind.config.js에 정의됨.
// - SVG group을 흔들 때는 transform-origin이 기본 (0,0)이라 화면 밖에서 도는 문제가 생긴다.
//   transformBox: 'view-box' + 원하는 좌표를 지정해야 새싹 밑동을 축으로 회전한다.

// 응원 방울(폼폼) 하나: 중심에서 바깥으로 뻗은 작은 잎들의 뭉치.
function Pompom({ cx, cy }) {
  const ring = (count, radius, len) =>
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(a) * radius;
      const y = cy + Math.sin(a) * radius;
      const deg = (a * 180) / Math.PI + 90; // 잎이 바깥을 향하도록 회전
      return (
        <ellipse
          key={`${radius}-${i}`}
          cx={x}
          cy={y}
          rx={3.2}
          ry={len}
          fill="#c3d95f"
          transform={`rotate(${deg} ${x} ${y})`}
        />
      );
    });

  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill="#b3cd52" />
      {ring(12, 11, 6.5)}
      {ring(7, 5, 5)}
    </g>
  );
}

export default function AllogMascot({
  size = 160,
  animated = true,
  className = '',
  'aria-label': ariaLabel = 'ALLOG 마스코트',
}) {
  const sway = animated ? 'animate-sprout-sway motion-reduce:animate-none' : '';
  const breathe = animated ? 'animate-char-breathe motion-reduce:animate-none' : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      {/* 밑동 잎(몸통 뒤, 화분 위로 살짝 삐져나옴) */}
      <path d="M70 150 Q52 150 46 132 Q66 134 74 150 Z" fill="#5aa03f" />
      <path d="M130 150 Q148 150 154 132 Q134 134 126 150 Z" fill="#5aa03f" />

      {/* 몸통 + 얼굴: 아주 미세하게 숨쉬듯 움직인다 (밑동을 축으로) */}
      <g
        className={breathe}
        style={{ transformOrigin: '100px 160px', transformBox: 'view-box' }}
      >
        <ellipse cx="100" cy="112" rx="47" ry="50" fill="#aecb5a" />
        {/* 눈 */}
        <ellipse cx="84" cy="110" rx="6.5" ry="8.5" fill="#1f1f1f" />
        <ellipse cx="116" cy="110" rx="6.5" ry="8.5" fill="#1f1f1f" />
        <circle cx="82" cy="107" r="2" fill="#fff" />
        <circle cx="114" cy="107" r="2" fill="#fff" />
        {/* 볼터치 */}
        <ellipse cx="70" cy="124" rx="6.5" ry="4" fill="#f3c6a3" />
        <ellipse cx="130" cy="124" rx="6.5" ry="4" fill="#f3c6a3" />
        {/* 벌린 입 + 혀 */}
        <path d="M88 121 Q100 119 112 121 Q110 135 100 136 Q90 135 88 121 Z" fill="#c73b2e" />
        <ellipse cx="100" cy="132" rx="4.5" ry="3" fill="#e35d4f" />
      </g>

      {/* 응원 방울 손 (몸통 옆) */}
      <Pompom cx={44} cy={116} />
      <Pompom cx={156} cy={116} />

      {/* 새싹: 밑동(100,66)을 축으로 살랑살랑 */}
      <g
        className={sway}
        style={{ transformOrigin: '100px 66px', transformBox: 'view-box' }}
      >
        <path d="M99 66 Q99 52 100 42" stroke="#77b24a" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* 왼쪽 잎 */}
        <path d="M100 46 Q82 40 76 24 Q94 26 100 46 Z" fill="#82c34a" />
        {/* 오른쪽 잎 */}
        <path d="M100 44 Q118 36 126 22 Q106 24 100 44 Z" fill="#8fce54" />
      </g>

      {/* 화분 (몸통 아래를 덮음) */}
      <path d="M60 150 L140 150 L133 186 Q132 190 128 190 L72 190 Q68 190 67 186 Z" fill="#f4f1e8" />
      <path d="M60 150 L140 150 L138 158 L62 158 Z" fill="#e9e4d6" />
      {/* ALLOG 로고 A (브랜드 딥그린) */}
      <text
        x="100"
        y="177"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#14453a"
        fontFamily="Pretendard, system-ui, sans-serif"
      >
        A
      </text>
    </svg>
  );
}
