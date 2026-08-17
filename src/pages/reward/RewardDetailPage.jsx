import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import rewards from "../../data/mockRewards";
import { deductRewardPoints, getRewardPoints } from "../../utils/storage";

function RewardDetailPage() {
  const navigate = useNavigate();
  const { rewardId } = useParams();
  const reward = rewards.find((item) => item.id === rewardId);

  const [points, setPoints] = useState(() => getRewardPoints());
  const [redeemed, setRedeemed] = useState(false);

  if (!reward) {
    return (
      <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
        <div className="flex min-h-screen w-full max-w-[402px] flex-col items-center justify-center gap-6 bg-[#f7f6f3] px-8 text-center">
          <h1 className="text-[17px] font-bold text-black">
            존재하지 않는 리워드예요.
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

  const canAfford = points >= reward.cost;

  const handleRedeem = () => {
    if (!canAfford) return;
    const nextPoints = deductRewardPoints(reward.cost);
    setPoints(nextPoints);
    setRedeemed(true);
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-full max-w-[402px] flex-col bg-[#f7f6f3]">
        <header className="flex items-center gap-3 px-5 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="flex h-[43px] w-[43px] items-center justify-center rounded-full border border-[#e7e3d8] bg-[#fefefe]"
          >
            <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none">
              <path
                d="M15 5l-7 7 7 7"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-[19px] font-bold text-black">리워드 상세</h1>
        </header>

        <main className="flex-1 space-y-5 px-5 pb-10">
          <div className="flex flex-col items-center rounded-[20px] border border-[#e7e3d8] bg-[#fefefe] p-6 text-center">
            <div className="flex h-[88px] w-[88px] items-center justify-center rounded-[20px] bg-[#f3efe4]">
              <img src={reward.icon} alt="" className="h-[44px] w-[44px]" />
            </div>
            <p className="mt-4 whitespace-pre-line text-[18px] font-bold text-black">
              {reward.title}
            </p>
            <p className="mt-1.5 text-[12px] font-medium text-[#6b7268]">
              {reward.note}
            </p>
            <p className="mt-4 flex items-center gap-1.5 text-[24px] font-bold text-black">
              <img src="/images/리워드.svg" alt="" className="h-[19px] w-[19px]" />
              {reward.cost}
            </p>
          </div>

          <div className="rounded-[16px] border border-[#e7e3d8] bg-[#fefefe] px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#6b7268]">
                보유 포인트
              </span>
              <span className="flex items-center gap-1 text-[15px] font-bold text-black">
                <img src="/images/리워드.svg" alt="" className="h-[14px] w-[14px]" />
                {points}
              </span>
            </div>
            <div className="my-3 h-px bg-[#e7e3d8]" />
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-[#6b7268]">
                교환 후 남는 포인트
              </span>
              <span
                className={`text-[15px] font-bold ${
                  canAfford ? "text-black" : "text-[#d9573b]"
                }`}
              >
                {canAfford ? points - reward.cost : "포인트 부족"}
              </span>
            </div>
          </div>
        </main>

        <div className="px-5 pb-8">
          <button
            type="button"
            disabled={!canAfford}
            onClick={handleRedeem}
            className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white disabled:bg-[#bababa]"
          >
            {canAfford ? "교환하기" : "포인트 부족"}
          </button>
        </div>
      </div>

      {redeemed ? (
        <div className="animate-backdrop-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-8">
          <div className="animate-fade-slide-up w-full max-w-[322px] rounded-[24px] bg-[#f7f6f3] p-6 text-center">
            <div className="mx-auto flex h-[56px] w-[56px] items-center justify-center rounded-full bg-black text-[22px] text-white">
              ✓
            </div>
            <p className="mt-4 text-[17px] font-bold text-black">
              구매가 완료됐어요!
            </p>
            <p className="mt-2 whitespace-pre-line text-[13px] font-bold text-black">
              {reward.title}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1 text-[13px] font-medium text-[#6b7268]">
              <img src="/images/리워드.svg" alt="" className="h-[12px] w-[12px]" />
              {reward.cost}포인트가 차감됐어요.
            </p>
            <div className="mt-4 rounded-[14px] bg-[#fefefe] px-4 py-3">
              <span className="text-[12px] font-semibold text-[#6b7268]">
                남은 포인트{" "}
              </span>
              <span className="text-[14px] font-bold text-black">
                {points}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/reward")}
              className="mt-5 h-[48px] w-full rounded-[16px] bg-black text-[14px] font-bold text-[#e5f4e8]"
            >
              확인
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default RewardDetailPage;
