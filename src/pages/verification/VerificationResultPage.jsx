import { Link, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button.jsx';
import { useVerificationStore } from '@/stores/verificationStore.js';

// 인증 결과 화면: AI 1차 검토 결과에 따라 성공 / 재인증으로 분기.
// 재인증이면 "무엇이 확인 안 됐는지" 안내 + 다시 촬영/신고 진입.
export default function VerificationResultPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const result = useVerificationStore((s) => s.result) ?? 'success';
  const reset = useVerificationStore((s) => s.reset);

  const isSuccess = result === 'success';

  const goToGroup = () => {
    reset();
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col items-center p-6 text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {/* 상태 아이콘 */}
        <div
          className={`flex h-20 w-20 items-center justify-center rounded-full text-4xl text-white ${
            isSuccess ? 'bg-success' : 'bg-danger'
          }`}
        >
          {isSuccess ? '✓' : '!'}
        </div>

        {isSuccess ? (
          <>
            <h1 className="text-h2 font-bold text-ink">인증 성공!</h1>
            <p className="text-body text-muted">오늘의 루틴을 완료했어요. 연속 인증이 이어졌어요 🔥</p>
          </>
        ) : (
          <>
            <h1 className="text-h2 font-bold text-ink">재인증이 필요해요</h1>
            <p className="text-body text-muted">영상에서 아래 항목이 확인되지 않았어요.</p>
            <ul className="rounded-card bg-surface px-5 py-3 text-caption text-subtle">
              <li>• 활동하는 모습이 명확히 보이지 않음</li>
              <li>• 영상이 너무 짧음</li>
            </ul>
          </>
        )}
      </div>

      {/* 액션 */}
      <div className="mt-6 flex w-full flex-col gap-2">
        {isSuccess ? (
          <Button onClick={goToGroup}>내 그룹으로</Button>
        ) : (
          <>
            <Button onClick={() => navigate(`/group/${groupId}/verify/camera`)}>
              다시 촬영하기
            </Button>
            <Link to="/report" className="py-2 text-caption font-semibold text-danger">
              판정에 이의 있어요 · 재인증 요청
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
