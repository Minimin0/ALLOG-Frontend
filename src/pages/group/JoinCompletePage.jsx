import { useLocation, useNavigate } from "react-router-dom";

function JoinCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const title = location.state?.title ?? "매일 물 1.5L 마시기";
  const { capacity, existingCount } = location.state ?? {};

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <div className="mx-auto flex min-h-screen w-full max-w-[402px] flex-col bg-[#f7f6f3] px-5">
        <div className="flex flex-1 flex-col items-center pt-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[28px] text-white">
            ✓
          </div>

          <h1 className="mt-6 text-center text-[25px] font-bold text-black">
            그룹 참가 완료!
          </h1>
          <p className="mt-2 text-center text-[16px] font-medium">
            <span className="text-[#14453a]">{title}</span>
            <span className="text-[#6b7268]"> 그룹에 참가했어요.</span>
          </p>
          <p className="mt-6 text-center text-[18px] font-semibold text-[#4a4a4a]">
            <span className="font-bold text-[#d9573b]">하트</span> 1개가 사용됐어요.
          </p>

          <div className="mt-8 flex w-[243px] flex-col items-center rounded-full border border-[#e7e3d8] bg-[#fefefe] py-6">
            <span className="text-[15px] font-semibold text-[#d9573b]">
              잔여 하트 수
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[20px] text-[#d9573b]">♥</span>
              <span className="text-[18px] font-bold text-black">2</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 pb-8">
          <button
            type="button"
            onClick={() =>
              navigate("/group/waiting-room", {
                state: { title, capacity, existingCount },
              })
            }
            className="h-[50px] w-full rounded-[27.5px] bg-black text-[15px] font-bold text-white"
          >
            그룹으로 이동
          </button>
          <button
            type="button"
            onClick={() => navigate("/explore")}
            className="w-full text-center text-[15px] font-semibold text-[#6b7268]"
          >
            나중에 볼게요
          </button>
        </div>
      </div>
    </div>
  );
}

export default JoinCompletePage;
