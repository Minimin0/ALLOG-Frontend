import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";
import { getCoachStyleImage } from "../../utils/constants";
import { getCoachStyle } from "../../utils/storage";

const SUCCESS_RATE = 60;
const SUCCESS_GOAL = 70;

function HomePage() {
  const navigate = useNavigate();
  const [bouncing, setBouncing] = useState(false);
  const [gaugeWidth, setGaugeWidth] = useState(0);
  const [coachImage] = useState(() => getCoachStyleImage(getCoachStyle()));

  useEffect(() => {
    const timer = setTimeout(() => setGaugeWidth(SUCCESS_RATE), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-full max-w-[402px] flex-col bg-[#f7f6f3]">
        <header className="flex items-center justify-between px-[30px] pt-4">
          <h1 className="text-[28px] font-bold text-black">홈</h1>
          <button
            type="button"
            onClick={() => setBouncing(true)}
            aria-label="AI 코치"
            className="h-[54px] w-[54px]"
          >
            <img
              src={coachImage}
              alt="AI 코치"
              className={`h-full w-full object-contain ${bouncing ? "bounce-once" : ""}`}
              onAnimationEnd={() => {
                setBouncing(false);
                navigate("/ai-coach");
              }}
            />
          </button>
        </header>

        <main className="flex-1 space-y-4 px-[30px] pb-8 pt-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => navigate("/heart-event")}
              className="rounded-[17px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2">
                <img src="/images/하트.svg" alt="" className="h-[19px] w-[21px]" />
                <span className="text-[18px] font-bold text-black">3</span>
              </div>
              <p className="mt-2 text-[12px] font-semibold text-[#d9573b]">
                보유 하트
              </p>
              <p className="mt-1 text-[12px] font-semibold text-[#6b7268]">
                하트 얻으러 가기 &gt;
              </p>
            </button>

            <button
              type="button"
              onClick={() => navigate("/reward")}
              className="rounded-[17px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-3 text-left"
            >
              <div className="flex items-center gap-2">
                <img src="/images/리워드.svg" alt="" className="h-[18px] w-[18px]" />
                <span className="text-[18px] font-bold text-black">1540</span>
              </div>
              <p className="mt-2 text-[12px] font-semibold text-[#c08a24]">
                포인트
              </p>
              <p className="mt-1 text-[12px] font-semibold text-[#6b7268]">
                포인트 혜택 보러가기 &gt;
              </p>
            </button>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-[#e7e3d8]">
            <div className="bg-[#edf2ec] px-5 pb-5 pt-4 text-center">
              <p className="text-[13px] font-semibold text-[#14453a]">
                오늘의 루틴
              </p>
              <p className="mt-2 text-[20px] font-bold text-black">
                하루 운동 30분
              </p>
              <button
                type="button"
                onClick={() => navigate("/verification/camera")}
                className="mt-4 h-[35px] w-full rounded-[15px] bg-[#14453a] text-[12px] font-bold text-[#e5f4e8]"
              >
                인증하러 하기
              </button>
            </div>
            <div className="flex items-center justify-center gap-4 bg-[#fefefe] py-3 text-[13px]">
              <span className="font-bold text-black">마감 오후 10:00</span>
              <span className="h-[16px] w-px bg-[#e7e3d8]" />
              <span className="font-semibold text-black">3시간 12분 남음</span>
            </div>
          </div>

          <div className="flex h-[81px] items-center rounded-[15px] border border-[#e7e3d8] bg-[#fefefe]">
            <button
              type="button"
              onClick={() => navigate("/my")}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div className="flex items-center gap-1.5">
                <img src="/images/차트.svg" alt="" className="h-[16px] w-[16px]" />
                <span className="text-[12px] font-bold text-black">개인 순위</span>
              </div>
              <p className="text-black">
                <span className="text-[25px] font-black text-[#14453a]">2</span>
                <span className="text-[12px] font-bold"> 위 / 5명</span>
              </p>
            </button>

            <span className="h-[47px] w-px bg-[#e7e3d8]" />

            <button
              type="button"
              onClick={() => navigate("/my")}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div className="flex items-center gap-1.5">
                <img src="/images/불.svg" alt="" className="h-[16px] w-[16px]" />
                <span className="text-[12px] font-bold text-black">연속 성공</span>
              </div>
              <p className="text-black">
                <span className="text-[25px] font-black text-[#14453a]">3</span>
                <span className="text-[18px] font-bold">일째</span>
              </p>
            </button>
          </div>

          <div className="rounded-[14px] border border-[#e7e3d8] bg-[#fefefe] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-semibold text-black">
                개인 성공률
              </span>
              <span className="text-[20px] font-black text-[#669884]">
                {SUCCESS_RATE}%
              </span>
            </div>
            <div className="relative mt-3 h-[9px] w-full rounded-full bg-[#efefef]">
              <div
                className="h-full rounded-full bg-[#669884] transition-[width] duration-1000 ease-out"
                style={{ width: `${gaugeWidth}%` }}
              />
              <div
                className="absolute top-[13px] flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${SUCCESS_GOAL}%` }}
              >
                <span className="text-[10px] leading-none text-[#c08a24]">▲</span>
              </div>
            </div>
            <p className="mt-2 text-right text-[11px] font-bold text-[#c08a24]">
              개인 목표 {SUCCESS_GOAL}%
            </p>
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

export default HomePage;
