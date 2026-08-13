import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button.jsx';
import VerifyHeader from '@/components/verification/VerifyHeader.jsx';
import { mockGroup } from '@/data/mockGroups.js';
import { useVerificationStore } from '@/stores/verificationStore.js';

// 오늘의 인증(인증 시작) 화면 — Figma. 동영상 촬영 영역 or 인증하기 → 카메라로.
export default function VerificationPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const reset = useVerificationStore((s) => s.reset);

  useEffect(() => {
    reset(); // 플로우 시작 시 이전 촬영 결과 초기화
  }, [reset]);

  const goCamera = () => navigate(`/group/${groupId}/verify/camera`);

  return (
    <div className="mx-auto flex min-h-full max-w-[402px] flex-col bg-bg p-5">
      <VerifyHeader />

      {/* DAY 카드 (가로 축소) — Figma node 1:642 기준: 오늘 인증 현황(N/M명 + 진행 점)도 함께 표시 */}
      <div className="mx-auto w-[86%] rounded-card bg-surface p-5 text-center shadow-sm">
        <p className="text-label text-primary">DAY {mockGroup.day}</p>
        <h2 className="text-h2 font-bold text-ink">{mockGroup.title}</h2>
        <p className="mt-1 text-caption text-muted">
          오늘 {mockGroup.verifiedToday}/{mockGroup.totalMembers}명 인증완료
        </p>
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: mockGroup.totalMembers }).map((_, i) => (
            <div
              key={i}
              className={`h-[21px] w-[21px] rounded-full ${
                i < mockGroup.verifiedToday ? 'bg-primary' : 'bg-surface-alt'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 촬영 영역 (탭 → 카메라) — Figma node 1:642 기준 297×396px, rounded-[51px] */}
      <button
        onClick={goCamera}
        className="mx-auto mt-5 flex w-[297px] max-w-full h-[396px] flex-col items-center justify-center gap-3 rounded-[51px] bg-line"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface shadow">
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-ink" fill="currentColor">
            <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        </span>
        <span className="text-body font-medium text-ink">동영상 촬영</span>
      </button>

      {/* 인증 가이드 (박스·글씨 키움) */}
      <div className="mt-5 rounded-card bg-primary-tint p-5">
        <p className="mb-3 text-section font-bold text-ink">인증 가이드</p>
        <ul className="space-y-2 text-body text-muted">
          <li>• 오늘 촬영한 동영상만 인증 가능합니다.</li>
          <li>• 얼굴은 가려도 괜찮습니다.</li>
          <li>• 운동하는 모습이 잘 보이도록 촬영해주세요.</li>
        </ul>
        {/* 확인 가능한 기록 형태 안내 */}
        <div className="mt-3 flex items-center gap-2 rounded-item bg-surface px-3 py-2 text-caption text-muted">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-primary" fill="currentColor">
            <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
          기록은 <span className="font-bold text-primary">3초 내외 짧은 동영상</span>으로 저장돼요.
        </div>
      </div>

      <Button size="lg" className="mt-5" onClick={goCamera}>
        인증하기
      </Button>
    </div>
  );
}
