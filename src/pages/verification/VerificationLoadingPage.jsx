import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useVerificationStore } from '@/stores/verificationStore.js';

// 동영상 분석(AI 1차 검토) 중 화면. 검토가 끝나면 판정을 스토어에 저장하고 결과로 이동.
// 실제로는 verificationApi가 영상을 업로드하고 판정을 돌려준다.
// 데모용 판정: 아래 값을 'retry'로 바꾸면 재인증 결과 화면을 확인할 수 있음.
const MOCK_RESULT = 'success'; // 'success' | 'retry'

export default function VerificationLoadingPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const media = useVerificationStore((s) => s.media);
  const setResult = useVerificationStore((s) => s.setResult);

  useEffect(() => {
    // 촬영 결과 없이 직접 진입하면 카메라로 되돌림
    if (!media) {
      navigate(`/group/${groupId}/verify/camera`, { replace: true });
      return;
    }
    // 분석 시뮬레이션 (실제로는 API 응답 대기)
    const timer = setTimeout(() => {
      setResult(MOCK_RESULT);
      navigate(`/group/${groupId}/verify/result`, { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [media, groupId, navigate, setResult]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 p-6">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-primary" />
      <p className="text-body font-medium text-ink">AI가 인증 영상을 분석하고 있어요…</p>
      <p className="text-caption text-muted">잠시만 기다려 주세요</p>
    </div>
  );
}
