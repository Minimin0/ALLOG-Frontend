import { useNavigate } from "react-router-dom";

function OnboardingCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-[#f7f6f3] px-5">
        <div className="flex h-[72px] items-center justify-between px-2 pt-1 text-[18px] font-semibold tracking-[-0.02em] text-[#111314]">
          <span className="pl-1">2:30</span>
          <div className="flex items-center gap-2 pr-1">
            <div className="flex items-end gap-[3px]">
              <span className="block h-2 w-1 rounded-[1px] bg-[#1d1d1d]" />
              <span className="block h-2.5 w-1 rounded-[1px] bg-[#1d1d1d]" />
              <span className="block h-3 w-1 rounded-[1px] bg-[#1d1d1d]" />
              <span className="block h-3.5 w-1 rounded-[1px] bg-[#1d1d1d]" />
            </div>
            <div className="h-3 w-4 rounded-[2px] border-[2px] border-[#1d1d1d] border-l-0 border-b-0 rotate-45" />
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center pt-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#14453a] text-[28px] text-white">
            ✓
          </div>

          <h1 className="mt-6 text-center text-[25px] font-bold leading-8 text-black">
            환영합니다!
            <br />
            하트 3개를 받았어요.
          </h1>

          <div className="mt-6 flex gap-3 text-[34px] leading-none text-[#d9573b]">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
          </div>

          <div className="mt-6 text-center text-[18px] font-semibold text-[#4a4a4a]">
            <span className="font-bold text-[#d9573b]">하트</span>는{" "}
            <span className="font-bold text-black">그룹 참가</span>에만
            사용돼요.
          </div>

          <div className="mt-6 w-full space-y-4 rounded-[23px] border border-[#e7e3d8] bg-[#fefefe] p-5">
            <div className="text-center text-[13px] font-semibold text-[#4a4a4a]">
              그룹에 참가할 때{" "}
              <span className="font-bold text-[#d9573b]">하트 1개</span>를
              사용해요.
            </div>
            <div className="h-px w-full bg-[#e7e3d8]" />
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 text-center text-[13px] font-semibold leading-5 text-[#4a4a4a]">
                그룹 공동 성공률 80% 이상
                <br />+<br />
                개인 달성율 70% 이상
              </div>
              <div className="text-[16px] text-[#4a4a4a]">→</div>
              <div className="flex-1 text-center text-[13px] font-semibold leading-5 text-[#d9573b]">
                하트 1개를
                <br />
                다시 받아요.
              </div>
            </div>
          </div>
        </div>

        <div className="pb-7">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-full rounded-[27.5px] bg-[#14453a] px-4 py-[18px] text-[15px] font-bold text-white"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingCompletePage;
