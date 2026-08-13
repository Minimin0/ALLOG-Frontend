const durationOptions = ["전체", "7일", "14일", "30일"];
const statusOptions = ["전체", "모집중", "정원 충족"];

function FilterModal({
  open,
  duration,
  status,
  onChangeDuration,
  onChangeStatus,
  onReset,
  onClose,
  onApply,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-[402px] rounded-t-[24px] bg-[#f7f6f3] p-6">
        <div className="flex items-center justify-between">
          <p className="text-[17px] font-bold text-black">필터</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#e7e3d8] bg-white text-[13px] text-black"
          >
            ×
          </button>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[13px] font-bold text-black">진행 기간</p>
          <div className="flex flex-wrap gap-2">
            {durationOptions.map((item) => {
              const active = duration === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onChangeDuration(item)}
                  className={`rounded-[10px] border px-4 py-2.5 text-[13px] font-semibold ${
                    active
                      ? "border-black bg-[#14453a] text-white"
                      : "border-[#e7e3d8] bg-[#fefefe] text-[#6b7268]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[13px] font-bold text-black">모집 상태</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((item) => {
              const active = status === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => onChangeStatus(item)}
                  className={`rounded-[10px] border px-4 py-2.5 text-[13px] font-semibold ${
                    active
                      ? "border-black bg-[#14453a] text-white"
                      : "border-[#e7e3d8] bg-[#fefefe] text-[#6b7268]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="h-[48px] shrink-0 rounded-[16px] border border-[#e7e3d8] bg-[#fefefe] px-5 text-[13px] font-bold text-[#6b7268]"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={onApply}
            className="h-[48px] flex-1 rounded-[16px] bg-[#14453a] text-[14px] font-bold text-[#e5f4e8]"
          >
            필터 적용하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;
