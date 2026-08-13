import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockGroup } from "../../data/mockGroups";

function InviteGroupPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mockGroup.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 권한이 없는 환경일 수 있음 — 조용히 무시
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-full max-w-[402px] flex-col bg-[#f7f6f3]">
        <header className="flex items-center gap-3 px-5 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="flex h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-black"
          >
            <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none">
              <path
                d="M15 5l-7 7 7 7"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-[19px] font-bold text-black">친구 초대하기</h1>
        </header>

        <main className="flex-1 px-5 pb-10">
          <div className="mt-4 rounded-[20px] border border-[#e7e3d8] bg-[#edf2ec] p-6 text-center">
            <p className="text-[14px] font-semibold text-black">{mockGroup.title}</p>
            <p className="mt-1 text-[12px] font-medium text-[#6b7268]">
              아래 코드를 공유하면 친구가 바로 참여할 수 있어요.
            </p>
            <div className="mt-4 rounded-[15px] bg-[#fefefe] py-5">
              <span className="text-[30px] font-bold tracking-[6px] text-[#14453a]">
                {mockGroup.inviteCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 w-full rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] py-3 text-[13px] font-bold text-[#4a4a4a]"
            >
              {copied ? "복사됨" : "코드 복사하기"}
            </button>
          </div>

          <div className="mt-5 rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-4">
            <p className="text-[13px] font-bold text-black">참여 방법</p>
            <ol className="mt-2 space-y-1 text-[12px] font-medium text-[#6b7268]">
              <li>1. 탐색 화면에서 &apos;코드로 참여하기&apos;를 눌러요.</li>
              <li>2. 위 코드를 입력하면 바로 참여돼요.</li>
            </ol>
          </div>
        </main>

        <div className="px-5 pb-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white"
          >
            그룹으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default InviteGroupPage;
