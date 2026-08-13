import { useState } from 'react';

import BottomSheet from '@/components/common/BottomSheet.jsx';
import Button from '@/components/common/Button.jsx';
import { REVERIFY_REASONS } from '@/utils/constants.js';

// 재인증 요청 바텀시트 — 피드에서 다른 멤버의 인증 카드 ⋯ 를 눌렀을 때.
export default function ReverifyRequestSheet({ open, onClose, onSubmit, targetName }) {
  const [reasonId, setReasonId] = useState(REVERIFY_REASONS[0].id); // 첫 사유 기본 선택
  const [etcText, setEtcText] = useState('');

  const handleSubmit = () => {
    // TODO: reportApi.reverify({ targetName, reasonId, etcText }) 연결
    onSubmit?.({ reasonId, etcText });
  };

  return (
    <BottomSheet open={open} onClose={onClose}>
      <h2 className="text-center text-h2 font-bold text-ink">재인증 요청</h2>
      <p className="mt-1 text-center text-caption text-muted">
        {targetName ? `${targetName}님의 ` : ''}재인증을 요청하려는 사유를 선택해주세요.
      </p>

      <div className="mt-5 space-y-2">
        {REVERIFY_REASONS.map((r) => {
          const selected = reasonId === r.id;
          return (
            <div key={r.id}>
              <button
                type="button"
                onClick={() => setReasonId(r.id)}
                className={`flex w-full items-center gap-3 rounded-item border px-4 py-3 text-left text-body ${
                  selected
                    ? 'border-primary bg-primary-tint font-semibold text-ink'
                    : 'border-line bg-surface text-subtle'
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    selected ? 'border-primary' : 'border-disabled'
                  }`}
                >
                  {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </span>
                {r.label}
              </button>

              {/* 기타 선택 시: 바로 밑에 직접 입력칸 (미선택 시 접힘) */}
              {r.id === 'etc' && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    reasonId === 'etc' ? 'mt-2 max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <textarea
                    value={etcText}
                    onChange={(e) => setEtcText(e.target.value)}
                    placeholder="사유를 직접 입력해주세요"
                    rows={3}
                    className="w-full resize-none rounded-item border border-line bg-surface p-3 text-body text-ink placeholder:text-disabled focus:border-primary focus:outline-none"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="danger" className="mt-6" onClick={handleSubmit}>
        재인증 요청하기
      </Button>
    </BottomSheet>
  );
}
