import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Button from '@/components/common/Button.jsx';
import Mascot from '@/components/verification/Mascot.jsx';
import { mockRetryGuide, mockVerifyFeedback } from '@/data/mockGroups.js';
import { useVerificationStore } from '@/stores/verificationStore.js';

// 마스코트 칭찬 한마디 (진입 시 15개 중 랜덤 1개)
const PRAISES = [
  '오늘도 해냈어요! 🌱',
  '역시 최고예요! 👏',
  '꾸준함이 멋져요! ✨',
  '완벽한 인증이에요! 🎉',
  '이 기세 그대로! 💪',
  '오늘도 한 걸음 더! 🌿',
  '몸도 마음도 튼튼! 🌞',
  '작은 습관이 큰 힘이 돼요 🌳',
  '오늘의 나, 칭찬해요! 👍',
  '멈추지 않는 게 멋져요 🔥',
  '루틴 완성, 대단해요! 🏅',
  '한결같은 당신이 최고 💚',
  '오늘도 새싹이 쑥쑥! 🌱',
  '해낼 줄 알았어요! ⭐',
  '내일도 함께해요! 🤝',
];

// 인증 결과 화면: AI 1차 검토 결과에 따라 성공 / 재인증으로 분기.
// - 성공: 마스코트 칭찬 + 최근 성공 패턴(연속 성공/자주 인증한 시간대) 짧게 피드백.
// - 재인증: "실패"만 알리지 않고 무엇이 확인 안 됐는지 + 다시 촬영하는 방법을 안내.
export default function VerificationResultPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const result = useVerificationStore((s) => s.result) ?? 'success';
  const reset = useVerificationStore((s) => s.reset);

  const isSuccess = result === 'success';
  const [praise] = useState(() => PRAISES[Math.floor(Math.random() * PRAISES.length)]);

  const goToGroup = () => {
    reset();
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col items-center p-6 text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {isSuccess ? (
          <>
            {/* 마스코트 칭찬 말풍선 */}
            <div className="relative animate-popIn rounded-2xl bg-surface px-4 py-2.5 text-body font-semibold text-ink shadow-md ring-1 ring-line">
              {praise}
              <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-[2px] bg-surface" />
            </div>

            {/* 성공: 원형 안에 마스코트 사진 (밑동 축으로 살랑 반동) */}
            <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-primary-tint">
              <div className="animate-char-breathe">
                <div className="origin-bottom animate-sprout-sway">
                  <Mascot className="h-28 w-auto" fallback="🌱" />
                </div>
              </div>
            </div>
            <h1 className="text-h2 font-bold text-ink">인증 성공!</h1>

            {/* 패턴 피드백: 연속 성공 / 최근 자주 인증한 시간대 */}
            <div className="flex w-full max-w-xs gap-2">
              <div className="flex-1 rounded-card bg-primary-tint px-3 py-2.5">
                <p className="text-caption text-muted">연속 성공</p>
                <p className="text-h2 font-bold text-primary">
                  {mockVerifyFeedback.streak}
                  <span className="text-caption font-bold">일 🔥</span>
                </p>
              </div>
              <div className="flex-1 rounded-card bg-primary-tint px-3 py-2.5">
                <p className="text-caption text-muted">최근 인증</p>
                <p className="pt-1 text-body font-bold text-primary">{mockVerifyFeedback.bestTime}</p>
              </div>
            </div>
            <p className="text-caption text-muted">
              주로 {mockVerifyFeedback.bestTime}에 인증했어요. 이 페이스 그대로! 💪
            </p>
          </>
        ) : (
          <>
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-danger text-4xl text-white">
              !
            </div>
            <h1 className="text-h2 font-bold text-ink">재인증이 필요해요</h1>
            <p className="text-body text-muted">실패가 아니에요 — 아래 항목이 확인되지 않았을 뿐이에요.</p>

            {/* 무엇이 확인되지 않았는지 */}
            <div className="w-full max-w-xs rounded-card bg-surface px-4 py-3 text-left">
              <p className="mb-1.5 text-caption font-bold text-danger">확인되지 않은 점</p>
              <ul className="space-y-1 text-caption text-subtle">
                {mockRetryGuide.notConfirmed.map((r) => (
                  <li key={r}>• {r}</li>
                ))}
              </ul>
            </div>

            {/* 다시 촬영하는 방법 */}
            <div className="w-full max-w-xs rounded-card bg-primary-tint px-4 py-3 text-left">
              <p className="mb-1.5 text-caption font-bold text-primary">이렇게 다시 찍어보세요</p>
              <ul className="space-y-1 text-caption text-muted">
                {mockRetryGuide.tips.map((t) => (
                  <li key={t} className="flex items-start gap-1.5">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12l5 5L20 6" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
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
