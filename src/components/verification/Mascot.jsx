import { useState } from 'react';

// ALLOG 마스코트. public/images/mascot.png 가 있으면 사용, 없으면 이모지 폴백.
// (분석 화면 링 안 / 인증 성공 화면 등에서 재사용)
export default function Mascot({ className = 'h-24 w-auto', fallback = '🌱' }) {
  const [ok, setOk] = useState(true);

  if (ok) {
    return (
      <img
        src="/images/mascot.png"
        onError={() => setOk(false)}
        alt="마스코트"
        className={`object-contain ${className}`}
      />
    );
  }
  return <span className="text-6xl leading-none">{fallback}</span>;
}
