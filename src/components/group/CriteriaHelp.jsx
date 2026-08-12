import { useState } from 'react';

import Modal from '@/components/common/Modal.jsx';
import { SCORE_WEIGHTS } from '@/utils/score.js';

// 시상대 우측 상단 회색 물음표(?) 버튼 + 순위 평가 기준 팝업.
// 시상대를 감싼 relative 컨테이너 안에 두면 우측 상단에 배치된다. 합산/정보 탭 공용.
export default function CriteriaHelp() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="순위 평가 기준 보기"
        className="absolute right-1 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-caption font-bold text-muted"
      >
        ?
      </button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="mb-5 text-center text-section font-bold text-ink">순위 평가 기준</h2>
        <ul className="divide-y divide-line">
          {SCORE_WEIGHTS.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-body font-semibold text-ink">{item.label}</p>
                <p className="mt-0.5 text-caption text-muted">{item.desc}</p>
              </div>
              <span className="shrink-0 rounded-pill border border-primary bg-primary-pale px-3 py-1 text-caption font-semibold text-primary">
                {item.weight}점
              </span>
            </li>
          ))}
        </ul>
      </Modal>
    </>
  );
}
