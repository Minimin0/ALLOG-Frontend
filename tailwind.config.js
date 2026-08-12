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
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        popIn: 'popIn 0.25s ease-out',
        fadeOut: 'fadeOut 0.2s ease-in forwards',
        popOut: 'popOut 0.2s ease-in forwards',
        slideUp: 'slideUp 0.3s ease-out',
        riseUp: 'riseUp 0.4s ease-out both',
        cheer: 'cheer 2s ease-in-out',
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
