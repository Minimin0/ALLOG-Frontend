function JoinGroupModal({ group, onClose, onConfirm }) {
  if (!group) return null;

  const rows = [
    { label: "그룹명", value: group.title },
    { label: "현재 인원", value: group.members },
    { label: "기간", value: group.period },
    { label: "최대 보상", value: `✦ ${group.reward}` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
      <div className="w-full max-w-[322px] rounded-[24px] bg-[#f7f6f3] p-6">
        <div className="relative text-center">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-0 top-0 flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#e7e3d8] bg-white text-[13px] text-black"
          >
            ×
          </button>
          <p className="px-6 text-[18px] font-bold text-[#14453a]">
            {group.title}
          </p>
          <div className="mt-2 flex justify-center gap-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="h-[8px] w-[8px] rounded-full bg-black" />
            ))}
          </div>
        </div>

        <div className="mt-5 divide-y divide-[#e7e3d8] border-t border-[#e7e3d8]">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between py-3">
              <span className="text-[14px] font-medium text-[#6b7268]">
                {row.label}
              </span>
              <span className="text-[15px] font-semibold text-black">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onConfirm}
          className="mt-5 h-[42px] w-full rounded-[16px] bg-black text-[13px] font-bold text-[#e5f4e8]"
        >
          참가하기
        </button>
      </div>
    </div>
  );
}

export default JoinGroupModal;
