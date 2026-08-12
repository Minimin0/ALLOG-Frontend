import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

const habitOptions = [
  { label: "셀프케어", image: "/images/셀프케어.png" },
  { label: "운동", image: "/images/운동.png" },
  { label: "식사", image: "/images/식사.png" },
  { label: "수면", image: "/images/수면.png" },
];

function HabitSelectPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);

  const canNext = selected.length > 0;

  const toggleHabit = (habit) => {
    setSelected((prev) =>
      prev.includes(habit)
        ? prev.filter((item) => item !== habit)
        : [...prev, habit],
    );
  };

  return (
    <OnboardingShell
      step={2}
      total={4}
      title="어떤 루틴을 개선하고 싶나요?"
      subtitle="관심 있는 습관 영역을 선택하면 맞춤 루틴을 추천해드릴게요."
      progress={50}
      onBack={() => navigate("/onboarding/basic-info")}
      onNext={() => navigate("/onboarding/coach-style")}
      nextLabel="다음"
      canNext={canNext}
    >
      <div className="grid grid-cols-2 gap-3">
        {habitOptions.map((item) => {
          const active = selected.includes(item.label);

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => toggleHabit(item.label)}
              className={`relative flex min-h-[118px] flex-col items-center justify-center rounded-[18px] border px-3 py-4 text-center transition ${
                active
                  ? "border-[#8bbf9d] bg-[#ebf8ee] shadow-[inset_0_0_0_1px_rgba(108,197,106,0.14)]"
                  : "border-[#dfe2df] bg-[#f6f4f2]"
              }`}
            >
              <img
                src={item.image}
                alt={item.label}
                className="mb-2 h-[48px] w-[48px] object-contain"
              />
              <div className="text-[16px] font-bold text-[#1b1b1b]">
                {item.label}
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

export default HabitSelectPage;
