import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button.jsx';
import VerifyHeader from '@/components/verification/VerifyHeader.jsx';
import { mockGroup } from '@/data/mockGroups.js';
import { useVerificationStore } from '@/stores/verificationStore.js';

// 오늘의 인증(촬영 결과 확인) 화면 — Figma. 사진 + 가이드 + 인증하기/다시 촬영하기.
export default function VerificationPreviewPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const media = useVerificationStore((s) => s.media);
  const reset = useVerificationStore((s) => s.reset);

  // 직접 진입/새로고침으로 촬영 결과가 없으면 카메라로
  if (!media) {
    return (
      <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-body text-muted">촬영된 결과가 없어요.</p>
        <Button fullWidth={false} onClick={() => navigate(`/group/${groupId}/verify/camera`)}>
          촬영하러 가기
        </Button>
      </div>
    );
  }

  const retake = () => {
    reset();
    navigate(`/group/${groupId}/verify/camera`);
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-bg p-5">
      <VerifyHeader />

      {/* DAY 카드 */}
      <div className="mb-4 rounded-card bg-surface p-5 text-center shadow-sm">
        <p className="text-label text-primary">DAY {mockGroup.day}</p>
        <h2 className="text-h2 font-bold text-ink">{mockGroup.title}</h2>
      </div>

      {/* 촬영 결과 (녹화 동영상) */}
      <div className="mb-4 overflow-hidden rounded-card">
        {media.type === 'video' ? (
          <video
            src={media.url}
            controls
            playsInline
            className="aspect-square w-full bg-black object-cover"
          />
        ) : (
          <img src={media.url} alt="촬영 결과" className="aspect-square w-full object-cover" />
        )}
      </div>

      {/* 인증 가이드 */}
      <div className="mb-4 rounded-card bg-primary-tint p-4">
        <p className="mb-2 text-label text-ink">인증 가이드</p>
        <ul className="space-y-1.5 text-caption text-muted">
          <li>• 오늘 촬영한 사진만 인증 가능합니다.</li>
          <li>• 얼굴은 가려도 괜찮습니다.</li>
          <li>• 운동하는 모습이 잘 보이도록 촬영해주세요.</li>
        </ul>
      </div>

      {/* 액션 */}
      <div className="mt-auto flex flex-col gap-2.5">
        <Button variant="dark" onClick={() => navigate(`/group/${groupId}/verify/loading`)}>
          인증하기
        </Button>
        <Button variant="secondary" onClick={retake}>
          다시 촬영하기
        </Button>
      </div>
    </div>
  );
}
