import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/common/Button.jsx';
import Header from '@/components/layout/Header.jsx';
import { REPORT_REASONS } from '@/utils/constants.js';

// 재인증 요청 / 부적절 인증 신고 화면.
// 사유 선택(필수) + 상세 입력 → 제출. 실제 전송은 reportApi로 연결 예정.
export default function ReportPage() {
  const navigate = useNavigate();
  const [reasonId, setReasonId] = useState(null);
  const [detail, setDetail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // 검증 규칙: 사유는 필수. '기타'를 고르면 상세 입력도 필수.
  const canSubmit = reasonId !== null && (reasonId !== 'etc' || detail.trim().length > 0);

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: reportApi.submit({ reasonId, detail }) 연결
    setSubmitted(true);
  };

  // 제출 완료 상태
  if (submitted) {
    return (
      <div className="mx-auto flex min-h-full max-w-[402px] flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-3xl text-white">
          ✓
        </div>
        <h1 className="text-h2 font-bold text-ink">접수됐어요</h1>
        <p className="text-body text-muted">검토 후 결과를 알려드릴게요.</p>
        <Button fullWidth={false} className="mt-2" onClick={() => navigate(-1)}>
          돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-full max-w-[402px] flex-col p-5">
      <Header title="재인증 요청 · 신고" />

      <p className="mb-4 text-body text-muted">사유를 선택해 주세요.</p>

      {/* 사유 선택 (단일 선택) */}
      <div className="mb-5 space-y-2">
        {REPORT_REASONS.map((reason) => {
          const selected = reasonId === reason.id;
          return (
            <button
              key={reason.id}
              onClick={() => setReasonId(reason.id)}
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
              {reason.label}
            </button>
          );
        })}
      </div>

      {/* 상세 입력 */}
      <label className="mb-2 text-caption font-semibold text-ink">
        상세 내용 {reasonId === 'etc' && <span className="text-danger">*</span>}
      </label>
      <textarea
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="구체적인 내용을 적어주세요 (선택)"
        rows={4}
        className="mb-5 w-full resize-none rounded-item border border-line bg-surface p-3 text-body text-ink placeholder:text-disabled focus:border-primary focus:outline-none"
      />

      {/* 제출 */}
      <Button className="mt-auto" disabled={!canSubmit} onClick={handleSubmit}>
        제출하기
      </Button>
    </div>
  );
}
