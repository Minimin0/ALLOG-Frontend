import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

const coachOptions = [
  {
    name: "응원형",
    tone: "따뜻하게 격려해드려요",
    image: "/images/응원형.png",
  },
  {
    name: "압박형",
    tone: "강하게 동기부여해드려요",
    image: "/images/압박형.png",
  },
  {
    name: "팩트형",
    tone: "수치와 사실로 알려드려요",
    image: "/images/팩트형.png",
  },
  { name: "유머형", tone: "재미있게 도와드려요", image: "/images/유머형.png" },
];

function CoachStylePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("응원형");

  return (
    <OnboardingShell
      step={3}
      total={4}
      title="어떤 방식으로"
      subtitle="선택한 코칭 스타일에 따라 루틴이 맞춤 추천됩니다."
      progress={75}
      onBack={() => navigate("/onboarding/habits")}
      onNext={() => navigate("/onboarding/lifestyle")}
      nextLabel="다음"
      canNext={Boolean(selected)}
    >
      <div className="grid grid-cols-2 gap-3">
        {coachOptions.map((option) => {
          const active = selected === option.name;

          return (
            <button
              key={option.name}
              type="button"
              onClick={() => setSelected(option.name)}
              className={`relative flex min-h-[150px] flex-col items-center justify-center rounded-[18px] border px-3 py-4 text-center transition ${
                active
                  ? "border-[#8ab88d] bg-[#ebf8ee] shadow-[inset_0_0_0_1px_rgba(108,197,106,0.14)]"
                  : "border-[#dfe2df] bg-[#f6f4f2]"
              }`}
            >
              <img
                src={option.image}
                alt={option.name}
                className="mb-3 h-[80px] w-[80px] object-contain"
              />
              <div className="text-[18px] font-bold text-[#1b1b1b]">
                {option.name}
              </div>
              <div className="mt-1 text-[12px] text-[#6f6a66]">
                {option.tone}
              </div>
              <img
                src={active ? "/images/Black Check.png" : "/images/Check.png"}
                alt={active ? "선택됨" : "선택 안 됨"}
                className="absolute right-3 top-3 h-5 w-5 object-contain"
              />
            </button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}

export default CoachStylePage;
