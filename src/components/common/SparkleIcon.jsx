// 보상 표시용 반짝임(빛) 아이콘. currentColor를 쓰므로 text-* 색을 그대로 따라간다.
export default function SparkleIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c.45 3.9 1.5 6 3.2 7.5C16.9 11 19 12 22 12c-3 0-5.1 1-6.8 2.5C13.5 16 12.45 18.1 12 22c-.45-3.9-1.5-6-3.2-7.5C7.1 13 5 12 2 12c3 0 5.1-1 6.8-2.5C10.5 8 11.55 5.9 12 2z" />
    </svg>
  );
}
