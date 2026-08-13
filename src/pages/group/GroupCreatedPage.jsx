import { useNavigate } from "react-router-dom";

function GroupCreatedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center gap-6 bg-[#f7f6f3] px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-[28px] text-white">
          ✓
        </div>
        <h1 className="text-[19px] font-bold text-black">
          그룹이 생성되었어요!
          <br />
          멤버들이 모이면 시작돼요.
        </h1>
        <button
          type="button"
          onClick={() => navigate("/group/waiting-room")}
          className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white"
        >
          대기실로 이동
        </button>
      </div>
    </div>
  );
}

export default GroupCreatedPage;
