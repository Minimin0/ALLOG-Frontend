import { useNavigate } from "react-router-dom";
import OnboardingShell from "./OnboardingShell";

const recommendations = [
  {
    name: "아침 체력 루틴 방",
    detail: "주 3회 · 30일 · 운동 + 생활 패턴",
    highlight: "새벽 루틴 정착형",
  },
  {
    name: "식사 관리 도전 방",
    detail: "주 5회 · 14일 · 식사 + 수면",
    highlight: "배식 루틴 집중형",
  },
  {
    name: "저녁 회복 루틴 방",
    detail: "주 2회 · 30일 · 수면 + 스트레스 관리",
    highlight: "회복형 루틴 추천",
  },
];

function GroupRecommendPage() {
  const navigate = useNavigate();

  return (
    <OnboardingShell
      step={5}
      total={5}
      title="맞춤 루틴 방을 추천해드려요."
      subtitle="나와 비슷한 생활 패턴을 가진 그룹을 골라보세요."
      progress={100}
      onBack={() => navigate("/onboarding/lifestyle")}
      onNext={() => navigate("/onboarding/complete")}
      nextLabel="홈으로 가기"
      canNext
    >
      <div className="space-y-3">
        {recommendations.map((item) => (
          <div
            key={item.name}
            className="rounded-[18px] border border-[#e1dfdb] bg-[#f6f4f2] p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-[15px] font-bold text-[#111111]">
                {item.name}
              </div>
              <span className="rounded-full bg-[#edf9ee] px-2 py-1 text-[10px] font-bold text-[#1f6a45]">
                {item.highlight}
              </span>
            </div>
            <div className="mt-2 text-[12px] text-[#67635f]">{item.detail}</div>
          </div>
        ))}
      </div>
    </OnboardingShell>
  );
}

export default GroupRecommendPage;
