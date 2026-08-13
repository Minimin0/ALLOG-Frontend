import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

const habitOptions = [
  { label: "수분케어", subtitle: "충분한 수분 섭취", image: "/images/셀프케어.svg" },
  { label: "운동", subtitle: "꾸준한 신체 운동", image: "/images/운동.svg" },
  { label: "식사", subtitle: "균형 잡힌 식단 유지", image: "/images/식사.svg" },
  { label: "수면", subtitle: "규칙적인 수면 패턴", image: "/images/수면.svg" },
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
      subtitle="여러 개를 선택할 수 있어요. AI가 맞춤 그룹을 추천해드립니다."
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
              className={`relative flex min-h-[98px] flex-col items-center justify-center gap-1 rounded-[15px] border px-3 py-4 text-center transition ${
                active
                  ? "border-2 border-[#14453a] bg-[#eaf4ec]"
                  : "border-[#e7e3d8] bg-[#fefefe]"
              }`}
            >
              <img
                src={item.image}
                alt={item.label}
                className="mb-1 h-[24px] w-[24px] object-contain"
              />
              <div className="text-[15px] font-bold text-black">
                {item.label}
              </div>
              <div className="text-[10px] font-medium text-[#4a4a4a]">
                {item.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}

export default HabitSelectPage;
