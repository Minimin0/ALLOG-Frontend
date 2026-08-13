import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockGroup } from "../../data/mockGroups";

function JoinByCodePage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setCode(event.target.value.toUpperCase().slice(0, 6));
    setError("");
  };

  const handleSubmit = () => {
    if (code.trim().length < 6) return;
    if (code === mockGroup.inviteCode) {
      navigate(`/group/${mockGroup.id}`);
    } else {
      setError("존재하지 않는 코드예요. 코드를 다시 확인해주세요.");
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
          <h1 className="text-[19px] font-bold text-black">코드로 참여하기</h1>
        </header>

        <main className="flex-1 px-5 pb-10">
          <p className="mt-2 text-[13px] font-medium text-[#6b7268]">
            친구에게 받은 6자리 초대 코드를 입력해주세요.
          </p>

          <input
            value={code}
            onChange={handleChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSubmit();
            }}
            placeholder="ABC123"
            maxLength={6}
            autoFocus
            className="mt-5 w-full rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-4 text-center text-[22px] font-bold tracking-[6px] text-black outline-none placeholder:text-[#bababa]"
          />

          {error ? (
            <p className="mt-2 text-center text-[12px] font-semibold text-[#d9573b]">
              {error}
            </p>
          ) : null}
        </main>

        <div className="px-5 pb-8">
          <button
            type="button"
            disabled={code.trim().length < 6}
            onClick={handleSubmit}
            className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white disabled:opacity-40"
          >
            참여하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinByCodePage;
