import { useNavigate } from "react-router-dom";

function SignUpAccountPage() {
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

        <div className="mt-5 flex-1">
          <h1 className="text-[30px] font-black leading-[1.1] tracking-[-0.06em] text-[#111111]">
            아이디와 비밀번호를
            <br />
            입력해주세요.
          </h1>

          <div className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-[17px] font-medium text-[#171717]">
                아이디
              </label>
              <input
                type="text"
                value="아이디 (4~13자리 이내)"
                className="w-full rounded-[18px] border border-[#d9d0ca] bg-[#f5f3f1] px-4 py-[16px] text-[16px] text-[#1a1a1a] outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-[17px] font-medium text-[#171717]">
                비밀번호
              </label>
              <input
                type="password"
                value="비밀번호 (10~12자리 이내)"
                className="w-full rounded-[18px] border border-[#d9d0ca] bg-[#f5f3f1] px-4 py-[16px] text-[16px] text-[#1a1a1a] outline-none"
              />
            </div>

            <div className="flex items-center justify-between rounded-[18px] border border-[#d9d0ca] bg-[#f5f3f1] px-4 py-[16px] text-[16px] text-[#1a1a1a]">
              <span className="text-[#717171]">비밀번호 확인</span>
              <img
                src="/images/Black Check.png"
                alt="확인 완료"
                className="h-5 w-5 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="pb-7">
          <button
            type="button"
            onClick={() => navigate("/onboarding/basic-info")}
            className="w-full rounded-[28px] bg-[#111111] px-4 py-[18px] text-[18px] font-bold text-white"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpAccountPage;
