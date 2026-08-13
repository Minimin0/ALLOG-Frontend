// 사용자 메시지 (오른쪽, 흰 말풍선)
export default function UserMessage({ children }) {
  return (
    <div className="animate-riseUp flex justify-end">
      <div className="max-w-[80%] whitespace-pre-line [word-break:keep-all] rounded-2xl rounded-tr-md bg-surface px-4 py-3 text-body leading-relaxed text-ink shadow-sm ring-1 ring-line">
        {children}
      </div>
    </div>
  );
}
