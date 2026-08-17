import { useNavigate } from 'react-router-dom';

// 인증 화면 공통 헤더: 검정 사각 뒤로가기 + 가운데 "오늘의 인증".
export default function VerifyHeader() {
  const navigate = useNavigate();
  return (
    <header className="relative mb-4 flex h-10 items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        aria-label="뒤로"
        className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-white"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <h1 className="text-section font-bold text-ink">오늘의 인증</h1>
    </header>
  );
}
