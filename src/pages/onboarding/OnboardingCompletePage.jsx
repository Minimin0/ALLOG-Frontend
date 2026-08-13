import { useNavigate } from "react-router-dom";

function OnboardingCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-[#f7f6f3] px-5">
        <div className="flex flex-1 flex-col items-center pt-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[28px] text-white">
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
            <div className="space-y-2 text-center">
              <p className="text-[13px] font-semibold leading-6 text-[#4a4a4a]">
                그룹 공동 성공률 80% 이상 + 개인 달성율 70% 이상
              </p>
              <div className="text-[14px] text-[#bababa]">↓</div>
              <p className="text-[13px] font-semibold leading-6 text-[#d9573b]">
                하트 1개를 다시 받아요.
              </p>
            </div>
          </div>
        </div>

        <div className="pb-7">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-full rounded-[27.5px] bg-black px-4 py-[18px] text-[15px] font-bold text-white"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingCompletePage;
