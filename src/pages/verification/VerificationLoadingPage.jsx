import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Mascot from '@/components/verification/Mascot.jsx';
import { useVerificationStore } from '@/stores/verificationStore.js';

// AI 분석 화면 — Figma 1:682. 마스코트 진행 링 + 4개 검사 항목 순차 완료 후 결과로.
const MOCK_RESULT = 'success'; // 'success' | 'retry'

const iconCls = 'h-7 w-7 text-ink';
const svg = (children) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={iconCls}>
    {children}
  </svg>
);
const PictureIcon = () => svg(<>
  <rect x="3" y="4" width="18" height="16" rx="2.5" />
  <circle cx="8.5" cy="9" r="1.4" />
  <path d="M4 17l4.5-4.5 3.5 3.5 3-3 5 5" />
</>);
const FlagIcon = () => svg(<>
  <path d="M6 21V4" />
  <path d="M6 5h11l-2.5 3.5L17 12H6" />
</>);
const ClockIcon = () => svg(<>
  <circle cx="12" cy="12" r="8.5" />
  <path d="M12 7.5V12l3 2" />
</>);
const ImagePlusIcon = () => svg(<>
  <rect x="3" y="5" width="13" height="13" rx="2.5" />
  <circle cx="7.5" cy="9.5" r="1.2" />
  <path d="M4 16l3.5-3.5 3 3" />
  <path d="M18.5 5.5v5M16 8h5" />
</>);

const CHECK_ITEMS = [
  { Icon: PictureIcon, title: '영상 품질 확인', sub: '선명도와 구도 확인' },
  { Icon: FlagIcon, title: '챌린지 일치 여부 확인', sub: '챌린지 조건 확인' },
  { Icon: ClockIcon, title: '촬영 시간 확인', sub: '오늘 촬영된 동영상인지 확인' },
  { Icon: ImagePlusIcon, title: '중복 이미지 검사', sub: '이전에 제출한 사진과 비교' },
];

export default function VerificationLoadingPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const media = useVerificationStore((s) => s.media);
  const setResult = useVerificationStore((s) => s.setResult);
  const [step, setStep] = useState(0); // 완료된 검사 개수

  useEffect(() => {
    if (!media) navigate(`/group/${groupId}/verify/camera`, { replace: true });
  }, [media, groupId, navigate]);

  useEffect(() => {
    if (!media) return;
    if (step >= CHECK_ITEMS.length) {
      setResult(MOCK_RESULT);
      navigate(`/group/${groupId}/verify/result`, { replace: true });
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(timer);
  }, [step, media, groupId, navigate, setResult]);

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col bg-gradient-to-b from-white to-primary-tint p-5">
      {/* 헤더 (초록 뒤로가기) — Figma: 버튼 43px·rounded 9, 타이틀 22px SemiBold */}
      <header className="relative mb-9 flex h-[43px] items-center justify-center">
        <button
          onClick={() => navigate(-1)}
          aria-label="뒤로"
          className="absolute left-0 flex h-[43px] w-[43px] items-center justify-center rounded-[9px] bg-primary text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-h2 tracking-tight text-ink">오늘의 인증</h1>
      </header>

      {/* 마스코트 + 진행 링 — Figma: 링 164px, 마스코트 108px (초록 아크 스피너) */}
      <div className="relative mx-auto mt-4 h-[164px] w-[164px]">
        <div
          className="absolute inset-0 animate-spin rounded-full [animation-duration:1.4s] motion-reduce:animate-none"
          style={{
            background: 'conic-gradient(var(--color-primary) 0deg 300deg, var(--color-line) 300deg 360deg)',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 6px), #000 calc(100% - 6px))',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="origin-bottom animate-boing motion-reduce:animate-none">
            <Mascot className="h-[108px] w-auto" />
          </div>
        </div>
      </div>

      <p className="mt-7 text-center text-xl font-bold text-ink">AI 가 인증 내용을 분석하고 있어요.</p>
      <p className="mt-2 text-center text-xl font-medium text-muted">잠시만 기다려주세요.</p>

      {/* 검사 항목 카드 — Figma: rounded 35, 흰 배경 + 베이지 테두리 */}
      <div className="mt-8 rounded-[35px] border border-line bg-surface px-2">
        {CHECK_ITEMS.map(({ Icon, title, sub }, i) => {
          const done = i < step;
          const loading = i === step;
          return (
            <div
              key={title}
              className={`flex items-center gap-3 px-3 py-4 ${
                i < CHECK_ITEMS.length - 1 ? 'border-b border-line' : ''
              }`}
            >
              <Icon />
              <div className="flex-1">
                <p className="text-body font-semibold text-ink">{title}</p>
                <p className="text-[10px] font-medium text-muted">{sub}</p>
              </div>
              {done ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">
                  ✓
                </span>
              ) : loading ? (
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-primary" />
              ) : (
                <span className="h-6 w-6 rounded-full border-2 border-line" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
