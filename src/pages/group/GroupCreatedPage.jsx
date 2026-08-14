import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateInviteCode } from "../../utils/format";

function GroupCreatedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    title = "매일 물 2L 마시기",
    capacity = 5,
    code = generateInviteCode(),
  } = location.state ?? {};
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 권한이 없는 환경일 수 있음 — 조용히 무시
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center gap-6 bg-[#f7f6f3] px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[28px] text-white">
          ✓
        </div>
        <h1 className="text-[19px] font-bold text-black">
          '{title}' 그룹이 생성되었어요!
          <br />
          {capacity}명이 모이면 시작돼요.
        </h1>

        <div className="w-full rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-4">
          <p className="text-[12px] font-semibold text-[#4a4a4a]">
            친구에게 이 코드를 공유해주세요
          </p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <span className="text-[26px] font-bold tracking-[4px] text-[#14453a]">
              {code}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-[#e7e3d8] bg-white px-3 py-1.5 text-[12px] font-bold text-[#4a4a4a]"
            >
              {copied ? "복사됨" : "복사"}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/group/waiting-room", {
              state: { title, capacity, code },
            })
          }
          className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white"
        >
          대기실로 이동
        </button>
      </div>
    </div>
  );
}

export default GroupCreatedPage;
