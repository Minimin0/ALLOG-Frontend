import { useEffect, useState } from 'react';

// 공통 모달(팝업). 열림/닫힘 모두 애니메이션.
// open이 false가 되면 바로 언마운트하지 않고 닫힘 애니메이션(0.2s) 후 제거.
export default function Modal({ open, onClose, children }) {
  const [render, setRender] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setRender(true);
      setClosing(false);
    } else if (render) {
      setClosing(true);
      const timer = setTimeout(() => setRender(false), 200); // 애니메이션 시간과 일치
      return () => clearTimeout(timer);
    }
  }, [open, render]);

  if (!render) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      {/* 어두운 배경 */}
      <div
        className={`absolute inset-0 bg-black/40 ${closing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 카드 */}
      <div
        className={`relative z-10 w-full max-w-sm rounded-card bg-surface p-6 shadow-xl ${
          closing ? 'animate-popOut' : 'animate-popIn'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute left-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
