import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

function LifestylePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    sleep: "6시간",
    wake: "7시",
    exercise: "주 3회",
    meal: "2회 이상",
    period: "30일",
  });

  const isValid =
    form.sleep && form.wake && form.exercise && form.meal && form.period;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <OnboardingShell
      step={4}
      total={4}
      title="생활 패턴을 알려주세요."
      subtitle="AI가 정확한 루틴을 추천해드립니다."
      progress={100}
      onBack={() => navigate("/onboarding/coach-style")}
      onNext={() => navigate("/onboarding/group-recommend")}
      nextLabel="다음"
      canNext={isValid}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="text-[18px] font-bold text-[#1f1f1f]">수면 시간</div>
          <div className="onboarding-grid-2">
            <button type="button" className="onboarding-choice is-active">
              <span className="name">6시간</span>
            </button>
            <button type="button" className="onboarding-choice">
              <span className="name">7시간</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[18px] font-bold text-[#1f1f1f]">운동 빈도</div>
          <div className="onboarding-grid-2">
            {[
              "주 1회",
              "주 2회",
              "주 3회",
              "주 4회",
              "주 5회",
              "거의 안 함",
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleChange("exercise", item)}
                className={`onboarding-choice ${form.exercise === item ? "is-active" : ""}`}
              >
                <span className="name">{item}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[18px] font-bold text-[#1f1f1f]">식사 빈도</div>
          <div className="onboarding-grid-2">
            {["먹지 않음", "1회", "2회", "3회 이상"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleChange("meal", item)}
                className={`onboarding-choice ${form.meal === item ? "is-active" : ""}`}
              >
                <span className="name">{item}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-[18px] font-bold text-[#1f1f1f]">선호 기간</div>
          <div className="onboarding-grid-2">
            {["7일", "14일", "30일"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleChange("period", item)}
                className={`onboarding-choice ${form.period === item ? "is-active" : ""}`}
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
