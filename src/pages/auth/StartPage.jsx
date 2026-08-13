import { useNavigate } from "react-router-dom";

function StartPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen justify-center bg-[#f6f3f1]">
      <div className="relative min-h-screen w-full max-w-[393px] overflow-hidden bg-white">
        <main className="flex flex-col items-center pt-[47px]">
          <img
            src="/images/Logo.svg"
            alt="ALLOG 로고"
            className="mt-[120px] h-[76px] w-[76px] object-contain"
          />

          <div className="mt-[1px] text-center text-[15px] font-bold leading-[35px] tracking-[-0.04em] text-[#000000]">
            Anti Lazing Log
          </div>

          <h1 className="mt-[12px] w-[282px] text-center text-[28px] font-bold leading-[29.5px] tracking-[1.4px] text-[#000000]">
            건강한 습관을
            <br />
            함께 만들어요.
          </h1>

          <p className="mt-[18px] w-[274px] text-center text-[12.643px] font-medium leading-[normal] text-[#000000]">
            AI 코치와 함께하는 루틴 챌린지.
            <br />
            크루와 함께라면 더 오래 지속할 수 있어요.
          </p>
        </main>

        <div className="mt-[112px] px-[48px]">
          <button
            type="button"
            onClick={() => navigate("/auth/login")}
            className="h-[50px] w-[296px] rounded-[20px] bg-[#000000] px-4 text-[18px] font-bold leading-[35px] tracking-[-0.03em] text-white"
          >
            시작하기
          </button>

          <p className="mt-[0px] text-center text-[13px] font-medium leading-[35px] text-[#000000]">
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={() => navigate("/auth/login")}
              className="text-[15px] font-bold text-[#000000] underline-offset-2 hover:underline"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StartPage;
