import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";
import { COACH_STYLES, DEFAULT_COACH_STYLE } from "../../utils/constants";
import { setCoachStyle } from "../../utils/storage";

const coachOptions = COACH_STYLES;

function CoachStylePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(DEFAULT_COACH_STYLE);

  return (
    <OnboardingShell
      step={3}
      total={4}
      title="어떤 방식으로 응원받고 싶나요?"
      subtitle="선택한 스타일로 AI 코치가 매일 말을 걸어드려요."
      onBack={() => navigate("/onboarding/habits")}
      onNext={() => {
        setCoachStyle(selected);
        navigate("/onboarding/lifestyle");
      }}
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
              className={`relative flex h-[160px] flex-col items-center justify-center rounded-[15px] border px-3 py-3 text-center transition ${
                active
                  ? "border-2 border-[#14453a] bg-[#eaf4ec]"
                  : "border-[#e7e3d8] bg-[#fefefe]"
              }`}
            >
              <img
                src={option.image}
                alt={option.name}
                className="mb-2 h-[80px] w-[80px] object-contain"
              />
              <div className="text-[15px] font-bold text-black">
                {option.name}
              </div>
              <div className="mt-1 text-[10px] font-medium text-[#4a4a4a]">
                {option.tone}
              </div>
            </button>
          );
        })}
      </div>
    </OnboardingShell>
  );
}

export default CoachStylePage;
