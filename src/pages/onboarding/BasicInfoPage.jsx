import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

const genders = ["여성", "남성", "선택 안 함"];

function BasicInfoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nickname: "",
    gender: "여성",
    birth: "",
    height: "",
    weight: "",
  });

  const isValid =
    form.nickname.trim() && form.birth && form.height && form.weight;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <OnboardingShell
      step={1}
      total={4}
      title="기본 정보를 입력해주세요."
      subtitle="입력하신 정보로 맞춤 루틴을 추천해드려요."
      progress={25}
      onBack={() => navigate("/auth/signup-account")}
      onNext={() => navigate("/onboarding/habits")}
      nextLabel="다음 단계로"
      canNext={isValid}
    >
      <div className="space-y-4">
        <div className="onboarding-field">
          <label className="onboarding-label">닉네임</label>
          <input
            value={form.nickname}
            onChange={(event) => handleChange("nickname", event.target.value)}
            placeholder="사용하실 닉네임을 입력해주세요."
            className="onboarding-input"
          />
        </div>

        <div className="onboarding-field">
          <label className="onboarding-label">성별</label>
          <div className="onboarding-grid-2">
            {genders.map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() => handleChange("gender", gender)}
                className={`onboarding-choice ${
                  form.gender === gender ? "is-active" : ""
                }`}
              >
                <span className="name">{gender}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="onboarding-field">
          <label className="onboarding-label">생년월일</label>
          <input
            type="date"
            value={form.birth}
            onChange={(event) => handleChange("birth", event.target.value)}
            className="onboarding-input"
          />
        </div>

        <div className="onboarding-grid-2">
          <div className="onboarding-field">
            <label className="onboarding-label">키</label>
            <input
              type="number"
              value={form.height}
              onChange={(event) => handleChange("height", event.target.value)}
              placeholder="cm"
              className="onboarding-input"
            />
          </div>

          <div className="onboarding-field">
            <label className="onboarding-label">몸무게</label>
            <input
              type="number"
              value={form.weight}
              onChange={(event) => handleChange("weight", event.target.value)}
              placeholder="kg"
              className="onboarding-input"
            />
          </div>
        </div>
      </div>
    </OnboardingShell>
  );
}

export default BasicInfoPage;
