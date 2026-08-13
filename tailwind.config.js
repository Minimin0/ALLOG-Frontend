/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // variables.css의 CSS 변수를 Tailwind로 연결 → Figma 토큰 변경 시 variables.css만 수정하면 됨
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        'primary-tint': 'var(--color-primary-tint)',
        'primary-pale': 'var(--color-primary-pale)',
        reward: 'var(--color-reward)',
        'reward-tint': 'var(--color-reward-tint)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-alt': 'var(--color-surface-alt)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        subtle: 'var(--color-subtle)',
        disabled: 'var(--color-disabled)',
        line: 'var(--color-line)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        'rank-gold': 'var(--color-rank-gold)',
        'rank-silver': 'var(--color-rank-silver)',
        'rank-bronze': 'var(--color-rank-bronze)',
      },
      backgroundColor: {
        'rank-gold-tint': 'var(--color-rank-gold-tint)',
        'rank-silver-tint': 'var(--color-rank-silver-tint)',
        'rank-bronze-tint': 'var(--color-rank-bronze-tint)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        item: 'var(--radius-item)',
        pill: 'var(--radius-pill)',
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Roboto',
          'sans-serif',
        ],
      },
      keyframes: {
        // 모달 등장 애니메이션
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        popOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        // 마스코트 새싹 반동(살짝 튕기며 흔들림) — transform-origin: bottom 과 함께 사용
        sprout: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-6px) rotate(-3deg)' },
          '55%': { transform: 'translateY(0) rotate(2.5deg)' },
          '80%': { transform: 'translateY(-2px) rotate(-1deg)' },
        },
        // 리스트 항목이 아래에서 올라오며 등장
        riseUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // 응원 효과: 어두워졌다(캐릭터 등장) → 다시 밝아지며 사라짐 (2초)
        cheer: {
          '0%': { opacity: '0' },
          '15%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        // 마스코트 새싹: 밑동을 축으로 좌우로 살랑살랑 (transform-origin은 컴포넌트에서 지정)
        'sprout-sway': {
          '0%, 100%': { transform: 'rotate(-7deg)' },
          '50%': { transform: 'rotate(7deg)' },
        },
        // 마스코트 몸통: 아주 미세하게 숨쉬듯 위아래로 (살아있는 느낌)
        'char-breathe': {
          '0%, 100%': { transform: 'translateY(0) scaleY(1)' },
          '50%': { transform: 'translateY(1.5px) scaleY(0.985)' },
        },
        // 눌렀을 때 한 번 폴짝 (transform-origin: bottom 과 함께)
        hop: {
          '0%': { transform: 'translateY(0) scale(1,1)' },
          '25%': { transform: 'translateY(-14px) scale(0.96,1.06)' },
          '55%': { transform: 'translateY(0) scale(1.06,0.9)' },
          '75%': { transform: 'translateY(-4px) scale(1,1)' },
          '100%': { transform: 'translateY(0) scale(1,1)' },
        },
        // 마스코트 통통 튀기 (스쿼시·스트레치) — transform-origin: bottom 과 함께 사용
        boing: {
          '0%, 100%': { transform: 'translateY(0) scale(1, 1)' },
          '20%': { transform: 'translateY(-16px) scale(0.96, 1.06)' },
          '40%': { transform: 'translateY(0) scale(1.06, 0.94)' },
          '55%': { transform: 'translateY(-6px) scale(0.99, 1.02)' },
          '70%': { transform: 'translateY(0) scale(1.03, 0.97)' },
        },
        // 델타 배지(+N)가 살짝 위로 떠서 둥실거림 (transform만 사용 → 옆 박스 영향 없음)
        float: {
          '0%, 100%': { transform: 'translateY(-4px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        // 폭죽: 가운데에서 사방으로 터져 나가며 사라짐 (per-element --dx/--dy/--rot)
        burst: {
          '0%': { transform: 'translate(-50%, -50%) scale(0.3) rotate(0deg)', opacity: '1' },
          '80%': { opacity: '1' },
          '100%': {
            transform:
              'translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(1) rotate(var(--rot))',
            opacity: '0',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        popIn: 'popIn 0.25s ease-out',
        fadeOut: 'fadeOut 0.2s ease-in forwards',
        popOut: 'popOut 0.2s ease-in forwards',
        slideUp: 'slideUp 0.3s ease-out',
        riseUp: 'riseUp 0.4s ease-out both',
        sprout: 'sprout 1.8s ease-in-out infinite',
        'sprout-sway': 'sprout-sway 2.8s ease-in-out infinite',
        'char-breathe': 'char-breathe 3.6s ease-in-out infinite',
        boing: 'boing 1.5s ease-in-out infinite',
        hop: 'hop 0.42s ease-out',
        cheer: 'cheer 2s ease-in-out',
        float: 'float 2s ease-in-out infinite',
        burst: 'burst 1.3s ease-out forwards',
      },
      fontSize: {
        // Figma 타이포 스케일 (line-height 포함)
        display: ['28px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        score: ['25px', { lineHeight: '1.1', fontWeight: '700' }],
        section: ['17px', { lineHeight: '1.4', fontWeight: '600' }],
        body: ['15px', { lineHeight: '1.5' }],
        label: ['12px', { lineHeight: '1.4', fontWeight: '700' }],
        caption: ['11px', { lineHeight: '1.4' }],
        nav: ['10px', { lineHeight: '1.2', fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};
