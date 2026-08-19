/** @type {import('tailwindcss').Config} */
// NativeWind(RN) 설정. 웹 variables.css의 ALLOG 토큰을 그대로 값으로 박아넣는다
// (RN엔 CSS 변수 개념이 없어 hex로 직접 정의).
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#14453a',
        'primary-dark': '#0e3229',
        'primary-tint': '#edf2ec',
        'primary-pale': '#eaf4ec',
        reward: '#c08a24',
        'reward-tint': '#f7f1e0',
        bg: '#f7f6f3',
        surface: '#fefefe',
        'surface-alt': '#eae9e7',
        ink: '#111111',
        muted: '#6b7268',
        subtle: '#4a4a4a',
        disabled: '#bababa',
        line: '#e7e3d8',
        success: '#14453a',
        warning: '#c08a24',
        danger: '#c0492f',
        heart: '#d9573b',
        'primary-light': '#669884',
        'mint-badge': '#e5f4e8',
        'beige-icon': '#f3efe4',
        'gray-btn': '#f0eee8',
        'gray-border': '#d9d9d9',
        // line과 값은 같지만 역할이 다르다(어두운 배경 위 텍스트 전용).
        'on-dark': '#e7e3d8',
        'rank-gold': '#f6b424',
        'rank-silver': '#bababa',
        'rank-bronze': '#cba04d',
      },
      borderRadius: {
        card: '24px',
        item: '15px',
        pill: '9999px',
      },
      // DESIGN_SYSTEM.md의 타이포 스케일. 문서에는 있었지만 여기 정의가 빠져 있어
      // text-display / text-h2 같은 클래스가 아무 효과도 내지 못하던 것을 채운다.
      // 기본 weight는 문서 표를 따르고, font-bold 등을 덧붙이면 그쪽이 이긴다.
      fontSize: {
        display: ['28px', { fontWeight: '700' }],
        h2: ['22px', { fontWeight: '600' }],
        score: ['25px', { fontWeight: '700' }],
        section: ['17px', { fontWeight: '600' }],
        body: ['15px'],
        label: ['12px', { fontWeight: '700' }],
        caption: ['11px'],
        nav: ['10px', { fontWeight: '700' }],
      },
    },
  },
  plugins: [],
};
