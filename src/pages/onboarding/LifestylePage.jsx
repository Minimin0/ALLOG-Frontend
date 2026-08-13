import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";
import SleepTimeDial from "../../components/common/SleepTimeDial";

const EXERCISE_OPTIONS = ["주 1회", "주 2회", "주 3회", "주 4회", "주 5회", "거의 안함"];
const MEAL_OPTIONS = ["먹지 않음", "1회", "2회", "3회 이상"];
const PERIOD_OPTIONS = ["7일", "14일", "30일"];

function LifestylePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sleepHours: 6,
    sleepMinutes: 30,
    exercise: null,
    meal: null,
    period: null,
  });

  const isValid = form.exercise && form.meal && form.period;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const sleepValue = form.sleepHours + form.sleepMinutes / 60;

  const handleSleepChange = (value) => {
    setForm((prev) => ({
      ...prev,
      sleepHours: Math.floor(value),
      sleepMinutes: Math.round((value % 1) * 60),
    }));
  };

  return (
    <OnboardingShell
      step={4}
      total={4}
      title="생활 패턴을 알려주세요"
      subtitle="AI가 최적의 그룹과 루틴 시간을 추천해 드려요."
      onBack={() => navigate("/onboarding/coach-style")}
      onNext={() => navigate("/onboarding/complete")}
      nextLabel="다음"
      canNext={isValid}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="text-center text-[15px] font-bold text-black">
            수면 시간
          </div>
          <div className="rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-6">
            <div className="flex items-end justify-center gap-1">
              <span className="text-[33px] font-bold text-black">
                {form.sleepHours}
              </span>
              <span className="mb-1 mr-3 text-[13px] text-[#696973]">시간</span>
              <span className="text-[33px] font-bold text-black">
                {form.sleepMinutes}
              </span>
              <span className="mb-1 text-[13px] text-[#696973]">분</span>
            </div>
            <div className="mt-5">
              <SleepTimeDial value={sleepValue} onChange={handleSleepChange} />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center text-[15px] font-bold text-black">
            운동 빈도
          </div>
          <div className="grid grid-cols-3 gap-3">
            {EXERCISE_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleChange("exercise", item)}
                className={`onboarding-choice justify-center ${form.exercise === item ? "is-active" : ""}`}
              >
                <span className="name">{item}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center text-[15px] font-bold text-black">
            식사 빈도
          </div>
          <div className="onboarding-grid-2">
            {MEAL_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleChange("meal", item)}
                className={`onboarding-choice justify-center ${form.meal === item ? "is-active" : ""}`}
              >
                <span className="name">{item}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-center text-[15px] font-bold text-black">
            선호 기간
          </div>
          <div className="grid grid-cols-3 gap-3">
            {PERIOD_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleChange("period", item)}
                className={`onboarding-choice justify-center ${form.period === item ? "is-active" : ""}`}
              >
                <span className="name">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

export default LifestylePage;
