// 추천 질문 칩 (하단, 눌러서 질문)
export default function AiSuggestionChip({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 whitespace-nowrap rounded-full border border-line bg-surface px-5 py-3 text-body font-medium text-ink shadow-sm active:scale-[0.98]"
    >
      {children}
    </button>
  );
}
