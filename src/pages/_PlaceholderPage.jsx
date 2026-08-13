import { useNavigate } from 'react-router-dom';

/**
 * 아직 구현 전인 화면용 임시 페이지.
 * 실제 화면을 만들 때 이 컴포넌트 대신 진짜 페이지 파일로 교체하면 된다.
 */
export default function PlaceholderPage({ title, note }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
      <span className="text-xs font-semibold text-muted">준비중 화면</span>
      <h1 className="text-xl font-bold text-ink">{title}</h1>
      {note && <p className="max-w-xs text-sm text-muted">{note}</p>}
      <button
        onClick={() => navigate('/')}
        className="mt-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white"
      >
        처음으로
      </button>
    </div>
  );
}
