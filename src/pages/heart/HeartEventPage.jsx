import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";

const events = [
  { key: "verify", title: "오늘의 루틴 인증하기", path: "/verification/camera" },
  { key: "follow", title: "ACC 인스타 그램 팔로우", path: "/explore" },
  { key: "invite", title: "친구 초대하기", path: "/group/invite" },
  { key: "cheer", title: "친구 응원해주기", path: "/explore" },
];

function HeartEventPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-[402px] flex-col bg-[#f7f6f3]">
        <header className="relative flex items-center px-[28px] pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="flex h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-black"
          >
            <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none">
              <path
                d="M15 5l-7 7 7 7"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[19px] font-semibold tracking-[-0.4px] text-black">
            하트 이벤트
          </h1>
        </header>

        <main className="flex-1 px-[29px] pb-8 pt-8">
          <div className="flex items-start justify-between gap-3">
            <div className="max-w-[220px]">
              <p className="text-[25px] font-bold leading-8 text-black">
                하트를 모아
                <br />
                다시 도전해요!
              </p>
              <p className="mt-3 text-[10px] font-medium text-[#4a4a4a]">
                하트 이벤트에 참여하고 하트를 다시 획득할 수 있어요.
              </p>
            </div>
            <div className="flex w-[114px] shrink-0 flex-col items-center justify-center gap-1 rounded-[7px] border border-[#e7e3d8] bg-[#fefefe] py-3">
              <div className="flex items-center gap-1.5">
                <img src="/images/하트.svg" alt="" className="h-[17px] w-[18px]" />
                <span className="text-[18px] font-bold text-black">3</span>
              </div>
              <span className="text-[12px] font-semibold text-[#d9573b]">
                보유 하트
              </span>
            </div>
          </div>

          <div className="mt-9 space-y-4">
            {events.map((event) => (
              <button
                key={event.key}
                type="button"
                onClick={() => navigate(event.path)}
                className="flex h-[50px] w-full items-center justify-between rounded-[13px] border border-[#e7e3d8] bg-white px-4"
              >
                <div className="flex items-center gap-3">
                  <img src="/images/Check3.svg" alt="" className="h-[20px] w-[20px]" />
                  <span className="text-[13px] font-semibold text-black">
                    {event.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <img src="/images/하트.svg" alt="" className="h-[12px] w-[13px]" />
                  <span className="text-[12px] font-semibold text-black">+1</span>
                  <span className="ml-1 text-[12px] text-[#bababa]">›</span>
                </div>
              </button>
            ))}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}

export default HeartEventPage;
