import { useNavigate } from "react-router-dom";

function WaitingRoomPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center gap-6 bg-[#f7f6f3] px-8 text-center">
        <h1 className="text-[19px] font-bold text-black">
          대기실
          <br />
          멤버들을 기다리고 있어요. (준비 중인 화면이에요)
        </h1>
        <button
          type="button"
          onClick={() => navigate("/explore/group/water-evening")}
          className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white"
        >
          그룹 홈으로 이동
        </button>
      </div>
    </div>
  );
}

export default WaitingRoomPage;
