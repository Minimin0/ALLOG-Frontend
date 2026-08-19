/** @type {import('tailwindcss').Config} */
// NativeWind(RN) 설정. 웹 variables.css의 ALLOG 토큰을 그대로 값으로 박아넣는다
// (RN엔 CSS 변수 개념이 없어 hex로 직접 정의).
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './mobile/**/*.{js,jsx,ts,tsx}',
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
        'rank-gold': '#f6b424',
        'rank-silver': '#bababa',
        'rank-bronze': '#cba04d',
      },
      borderRadius: {
        card: '24px',
        item: '15px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
