import { useNavigate } from "react-router-dom";

function OnboardingCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f2f1ee]">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-[#f2f1ee] px-5">
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

        <div className="flex flex-1 flex-col items-center justify-center pt-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#111111] text-[30px] text-white">
            ✓
          </div>

          <h1 className="mt-7 text-center text-[28px] font-black leading-[1.2] tracking-[-0.06em] text-[#111111]">
            환영합니다!
            <br />
            하트 3개를 받았어요.
          </h1>

          <div className="mt-6 flex gap-3 text-[38px] leading-none text-[#f36d4d]">
            <span>♥</span>
            <span>♥</span>
            <span>♥</span>
          </div>

          <div className="mt-5 text-center text-[15px] font-medium text-[#3d3a36]">
            하트는 그룹 참여 시 사용할 수 있어요.
          </div>

          <div className="mt-6 w-full rounded-[20px] border border-[#d9d1ca] bg-[#f6f3f1] p-4 text-center text-[15px] text-[#1a1917]">
            그룹에 참가할 때 하트 1개를 사용해요.
          </div>
        </div>

        <div className="pb-7">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-[28px] bg-[#111111] px-4 py-[18px] text-[18px] font-bold text-white"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingCompletePage;
