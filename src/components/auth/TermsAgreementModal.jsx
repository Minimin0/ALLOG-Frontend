import { useState } from "react";

const agreementItems = [
  {
    key: "terms",
    label: "이용약관 동의",
    required: true,
    detail:
      "루틴방 참여, 하트 사용·반환, 인증 및 평가 방식 등 ALLOG 서비스 이용 전반에 관한 약관이에요. 완주 시 하트가 반환되고, 미완주 시에는 반환되지 않아요.",
  },
  {
    key: "privacy",
    label: "개인정보 수집 및 이용 동의",
    required: true,
    detail:
      "닉네임, 생년월일, 신체 정보 등 맞춤 루틴 추천에 필요한 최소한의 정보만 수집해요. 수집된 정보는 목적 달성 후 관련 절차에 따라 파기돼요.",
  },
  {
    key: "marketing",
    label: "마케팅 정보 수신 동의",
    required: false,
    detail:
      "AAC 혜택, 신규 리워드, 이벤트 소식을 이메일·앱 알림으로 받아보실 수 있어요. 동의하지 않아도 서비스 이용에는 제한이 없어요.",
  },
];

function TermsAgreementModal({ open, agreements, onToggle, onToggleAll, onClose, onConfirm }) {
  const [openDetail, setOpenDetail] = useState(null);

  if (!open) return null;

  const allChecked = agreementItems.every((item) => agreements[item.key]);
  const requiredChecked = agreementItems
    .filter((item) => item.required)
    .every((item) => agreements[item.key]);

  return (
    <div className="animate-backdrop-fade-in fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="animate-sheet-slide-up w-full max-w-[402px] rounded-t-[24px] bg-[#f7f6f3] p-6">
        <div className="flex items-center justify-between">
          <p className="text-[17px] font-bold text-black">약관 동의</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#e7e3d8] bg-white text-[13px] text-black"
          >
            ×
          </button>
        </div>

        <button
          type="button"
          onClick={onToggleAll}
          className="mt-4 flex w-full items-center gap-2 rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-3.5 text-left"
        >
          <span
            className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${
              allChecked ? "bg-[#14453a]" : "border border-[#bababa]"
            }`}
          >
            {allChecked ? (
              <span className="text-[10px] font-bold text-white">✓</span>
            ) : null}
          </span>
          <span className="text-[14px] font-bold text-black">약관 전체 동의</span>
        </button>

        <div className="mt-3 divide-y divide-[#e7e3d8] rounded-[15px] border border-[#e7e3d8] bg-[#fefefe]">
          {agreementItems.map((item) => {
            const checked = agreements[item.key];
            const detailOpen = openDetail === item.key;
            return (
              <div key={item.key} className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggle(item.key)}
                    className="flex flex-1 items-center gap-2 text-left"
                  >
                    <span
                      className={`flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full ${
                        checked ? "bg-[#14453a]" : "border border-[#bababa]"
                      }`}
                    >
                      {checked ? (
                        <span className="text-[9px] font-bold text-white">✓</span>
                      ) : null}
                    </span>
                    <span className="text-[13px] font-semibold text-black">
                      <span
                        className={
                          item.required ? "text-[#14453a]" : "text-[#6b7268]"
                        }
                      >
                        {item.required ? "[필수] " : "[선택] "}
                      </span>
                      {item.label}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenDetail(detailOpen ? null : item.key)}
                    className="shrink-0 text-[11px] font-medium text-[#bababa] underline"
                  >
                    {detailOpen ? "접기" : "보기"}
                  </button>
                </div>
                <div className={`accordion-content ${detailOpen ? "is-open" : ""}`}>
                  <div>
                    <p className="pt-2.5 text-[11px] font-medium leading-relaxed text-[#6b7268]">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          disabled={!requiredChecked}
          onClick={onConfirm}
          className="mt-5 h-[50px] w-full rounded-[27.5px] bg-black text-[15px] font-bold text-white disabled:bg-[#bababa]"
        >
          동의하고 계속하기
        </button>
      </div>
    </div>
  );
}

export default TermsAgreementModal;
