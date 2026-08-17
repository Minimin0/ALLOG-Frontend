// 공통 바텀시트(아래서 위로 올라오는 팝업).
// 반투명 어두운 배경(페이드) + 하단 고정 패널(슬라이드 업) + 손잡이 바 + 우상단 X.
export default function BottomSheet({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 반투명 배경 (뒤 화면이 비침 + 페이드) */}
      <div className="absolute inset-0 animate-fadeIn bg-black/40" onClick={onClose} aria-hidden="true" />

      {/* 패널 */}
      <div className="relative z-10 max-h-[85vh] w-full max-w-[402px] animate-slideUp overflow-y-auto rounded-t-[28px] bg-surface px-5 pb-8 pt-3 shadow-xl">
        {/* 손잡이 바 */}
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-ink" />

        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-5 top-5 flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white"
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
