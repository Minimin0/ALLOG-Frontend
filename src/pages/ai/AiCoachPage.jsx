import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoachStyleImage, getCoachStyleTone } from "../../utils/constants";
import { getCoachStyle } from "../../utils/storage";

function AiCoachPage() {
  const navigate = useNavigate();
  const [style] = useState(() => getCoachStyle());

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-[402px] flex-col items-center justify-center gap-6 bg-[#f7f6f3] px-8 text-center">
        <img
          src={getCoachStyleImage(style)}
          alt="AI 코치"
          className="h-[120px] w-[120px] object-contain"
        />
        <h1 className="text-[19px] font-bold text-black">
          AI 코칭 화면
          <br />
          (준비 중이에요)
        </h1>
        <p className="-mt-3 text-[13px] font-medium text-[#6b7268]">
          {getCoachStyleTone(style)}
        </p>
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default AiCoachPage;
