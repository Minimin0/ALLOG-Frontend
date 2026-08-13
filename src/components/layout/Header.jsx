import { useNavigate } from 'react-router-dom';

// 공통 상단 헤더 (뒤로가기 + 제목). 서브 화면들이 반복하던 헤더 마크업을 통일.
// onBack을 주면 그 동작, 없으면 브라우저 뒤로가기(navigate(-1)).
export default function Header({ title, onBack, right }) {
  const navigate = useNavigate();
  return (
    <header className="mb-5 flex items-center gap-2">
      <button
        onClick={onBack ?? (() => navigate(-1))}
        aria-label="뒤로"
        className="text-section text-ink"
      >
        &lt;
      </button>
      <h1 className="flex-1 text-h2 font-bold text-ink">{title}</h1>
      {right}
    </header>
  );
}
