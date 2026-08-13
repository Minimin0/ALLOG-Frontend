import { useNavigate, useParams } from "react-router-dom";

function RewardDetailPage() {
  const navigate = useNavigate();
  const { rewardId } = useParams();

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-[402px] flex-col items-center justify-center gap-6 bg-[#f7f6f3] px-8 text-center">
        <h1 className="text-[19px] font-bold text-black">
          리워드 상세 화면
          <br />
          {rewardId ? `(${rewardId})` : ""}
          <br />
          (준비 중이에요)
        </h1>
        <button
          type="button"
          onClick={() => navigate("/reward")}
          className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white"
        >
          리워드 목록으로
        </button>
      </div>
    </div>
  );
}

export default RewardDetailPage;
