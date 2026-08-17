import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toggle from "../../components/common/Toggle";

const initialSettings = [
  {
    key: "routine",
    label: "루틴 인증 알림",
    desc: "마감 임박, 인증 리마인드",
    value: true,
  },
  {
    key: "group",
    label: "그룹 활동 알림",
    desc: "응원, 댓글, 새 멤버 참가",
    value: true,
  },
  {
    key: "goal",
    label: "공동 목표 달성 알림",
    desc: "그룹 공동 목표 달성 시 알림",
    value: true,
  },
  {
    key: "reward",
    label: "리워드 · 이벤트 알림",
    desc: "하트 이벤트, 신규 리워드 소식",
    value: true,
  },
  {
    key: "marketing",
    label: "마케팅 알림",
    desc: "AAC 혜택 및 프로모션 소식",
    value: false,
  },
];

function NotificationSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(initialSettings);

  const updateSetting = (key, value) => {
    setSettings((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item)),
    );
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
          <h1 className="text-[19px] font-bold text-black">알림 설정</h1>
        </header>

        <main className="flex-1 space-y-3 px-5 pb-10">
          <div className="divide-y divide-[#e7e3d8] rounded-[20px] border border-[#e7e3d8] bg-[#fefefe]">
            {settings.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 px-5 py-4"
              >
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-black">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-[#6b7268]">
                    {item.desc}
                  </p>
                </div>
                <Toggle
                  checked={item.value}
                  onChange={(next) => updateSetting(item.key, next)}
                  label={item.label}
                />
              </div>
            ))}
          </div>

          <p className="px-1 text-[11px] font-medium leading-relaxed text-[#6b7268]">
            루틴 인증 알림을 꺼두면 마감 임박 리마인드를 받지 못해 완주율에
            영향을 줄 수 있어요.
          </p>
        </main>
      </div>
    </div>
  );
}

export default NotificationSettingsPage;
