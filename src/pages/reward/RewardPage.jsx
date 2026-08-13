import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";

const categories = ["체험", "상품", "기타", "전체"];

const sortOptions = ["인기 높은 순", "가격 높은 순", "가격 낮은 순"];

const points = 1540;

const rewards = [
  {
    id: "serum-trial",
    title: "AAC 시그니처 세럼 체험권",
    cost: 1500,
    note: "교환 후 30일 이내 사용",
    icon: "/images/체험권.svg",
  },
  {
    id: "discount-15",
    title: "공식몰 15% 할인 쿠폰",
    cost: 2000,
    note: "교환 후 30일 이내 사용",
    icon: "/images/할인쿠폰.svg",
  },
  {
    id: "free-shipping",
    title: "무료 배송 쿠폰(3만원 이상)",
    cost: 2000,
    note: "교환 후 30일 이내 사용",
    icon: "/images/배송.svg",
  },
];

function RewardPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("전체");
  const [sort, setSort] = useState(sortOptions[0]);
  const [sortOpen, setSortOpen] = useState(false);

  const sortedRewards = [...rewards].sort((a, b) => {
    if (sort === "가격 높은 순") return b.cost - a.cost;
    if (sort === "가격 낮은 순") return a.cost - b.cost;
    return 0;
  });

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-[402px] flex-col bg-[#f7f6f3]">
        <header className="px-[30px] pt-4">
          <h1 className="text-[28px] font-bold text-black">리워드</h1>
        </header>

        <main className="flex-1 space-y-5 px-[30px] pb-8 pt-4">
          <div className="rounded-[13px] bg-[#4a3a18] p-5 shadow-[0_0_17px_0_rgba(0,0,0,0.35)]">
            <p className="text-[15px] font-semibold text-[#e7e3d8]">
              사용가능한 리워드 포인트
            </p>
            <div className="mt-2 flex items-end justify-between">
              <p className="flex items-center gap-1.5 text-[30px] font-bold text-[#e7e3d8]">
                <img src="/images/리워드.svg" alt="" className="h-[22px] w-[22px]" />
                {points}
              </p>
              <a
                href="https://anti-agingclub.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="pb-1 text-[12px] font-bold text-[#fefefe]"
              >
                AAC 홈페이지 바로가기
              </a>
            </div>
            <div className="my-3 h-px bg-[#e7e3d8]/30" />
            <p className="text-[10px] font-medium text-[#e7e3d8]">
              포인트는 ACC 상품과 웰니스 혜택에만 사용돼요.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {categories.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`rounded-[10px] bg-[#fefefe] py-2.5 text-[13px] font-semibold shadow-[0_0_2px_rgba(0,0,0,0.25)] ${
                    active ? "text-black" : "text-[#6b7268]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div className="relative flex justify-end">
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              className="flex items-center gap-1.5 rounded-[6px] bg-[#e7e3d8] px-3.5 py-1.5 text-[13px] font-semibold text-[#696973]"
            >
              {sort}
              <span
                className="text-[10px] transition-transform"
                style={sortOpen ? { transform: "rotate(180deg)" } : undefined}
              >
                ⌄
              </span>
            </button>

            {sortOpen ? (
              <div className="absolute right-0 top-[36px] z-10 w-[128px] overflow-hidden rounded-[12px] bg-[#fefefe] py-1 shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setSort(option);
                      setSortOpen(false);
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-[12px] font-semibold ${
                      sort === option ? "text-black" : "text-[#696973]"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-3">
            {sortedRewards.map((reward) => {
              const canAfford = points >= reward.cost;
              return (
                <button
                  key={reward.id}
                  type="button"
                  onClick={() => navigate(`/reward/${reward.id}`)}
                  className="flex w-full items-center gap-3 rounded-[13px] bg-[#fefefe] p-4 text-left"
                >
                  <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[12px] bg-[#f3efe4]">
                    <img src={reward.icon} alt="" className="h-[26px] w-[26px]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-black">
                      {reward.title}
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-[#6b7268]">
                      {reward.note}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1 text-[15px] font-bold text-black">
                      <img src="/images/리워드.svg" alt="" className="h-[14px] w-[14px]" />
                      {reward.cost}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-[10px] font-bold ${
                      canAfford
                        ? "bg-black text-white"
                        : "bg-[#bababa] text-white"
                    }`}
                  >
                    {canAfford ? "교환하기" : "포인트 부족"}
                  </span>
                </button>
              );
            })}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

export default RewardPage;
