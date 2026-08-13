import { useNavigate, useLocation } from "react-router-dom";

const tabs = [
  {
    key: "my-group",
    label: "내 그룹",
    path: "/group/my",
    icon: "/images/내 그룹.svg",
  },
  {
    key: "explore",
    label: "탐색",
    path: "/explore",
    icon: "/images/탐색.svg",
  },
  {
    key: "reward",
    label: "리워드",
    path: "/reward",
    icon: "/images/리워드_언더바.svg",
  },
  {
    key: "my",
    label: "마이 페이지",
    path: "/my",
    icon: "/images/마이페이지.svg",
  },
];

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const homeActive = location.pathname.startsWith("/home");

  const renderTab = (tab) => {
    const active = location.pathname.startsWith(tab.path);
    return (
      <button
        key={tab.key}
        type="button"
        onClick={() => navigate(tab.path)}
        className="flex flex-col items-center gap-1"
      >
        <img
          src={tab.icon}
          alt=""
          className="h-[22px] w-[22px]"
          style={active ? { filter: "brightness(0) saturate(100%)" } : undefined}
        />
        <span
          className={`text-[10px] font-bold ${
            active ? "text-black" : "text-[#bababa]"
          }`}
        >
          {tab.label}
        </span>
      </button>
    );
  };

  return (
    <div className="pointer-events-none sticky bottom-0 left-0 right-0 z-20 flex justify-center">
      <div className="pointer-events-auto relative w-full">
        <div className="absolute left-1/2 top-0 z-10 flex h-[71px] w-[71px] -translate-x-1/2 -translate-y-[45px] items-center justify-center rounded-full bg-white">
          <button
            type="button"
            onClick={() => navigate("/home")}
            aria-label="홈"
            className={`flex h-[54px] w-[54px] items-center justify-center rounded-full ${
              homeActive ? "bg-black" : "bg-[#bababa]"
            }`}
          >
            <svg viewBox="188 20 32 34" className="h-[24px] w-[22px]">
              <path
                fill="#ffffff"
                d="M193 47.975V33.4883C193 33.0617 193.096 32.6578 193.287 32.2767C193.478 31.8956 193.741 31.5817 194.077 31.335L203.052 24.5383C203.522 24.1794 204.058 24 204.662 24C205.265 24 205.805 24.1794 206.282 24.5383L215.257 31.3333C215.593 31.58 215.857 31.8944 216.047 32.2767C216.238 32.6578 216.333 33.0617 216.333 33.4883V47.975C216.333 48.4217 216.167 48.8111 215.835 49.1433C215.503 49.4756 215.113 49.6417 214.667 49.6417H209.027C208.644 49.6417 208.324 49.5128 208.067 49.255C207.809 48.9961 207.68 48.6761 207.68 48.295V40.3467C207.68 39.9656 207.551 39.6461 207.293 39.3883C207.034 39.1294 206.714 39 206.333 39H203C202.619 39 202.299 39.1294 202.042 39.3883C201.783 39.6461 201.653 39.9656 201.653 40.3467V48.2967C201.653 48.6778 201.524 48.9972 201.267 49.255C201.009 49.5128 200.689 49.6417 200.308 49.6417H194.667C194.22 49.6417 193.831 49.4756 193.498 49.1433C193.166 48.8111 193 48.4217 193 47.975Z"
              />
            </svg>
          </button>
        </div>

        <nav className="flex h-[66px] items-center justify-between bg-white px-[32px] shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
          {tabs.slice(0, 2).map(renderTab)}
          <span className="w-[62px]" aria-hidden="true" />
          {tabs.slice(2).map(renderTab)}
        </nav>
      </div>
    </div>
  );
}

export default BottomNav;
