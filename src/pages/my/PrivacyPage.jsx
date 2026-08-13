import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toggle from "../../components/common/Toggle";

const minimizationRows = [
  {
    title: "프로필",
    desc: "닉네임, 선택 이미지 등 최소 정보 중심으로만 저장해요.",
  },
  {
    title: "온보딩 정보",
    desc: "루틴방 추천에 필요한 기본 생활 패턴·습관·기간만 수집해요.",
  },
  {
    title: "인증 콘텐츠",
    desc: "루틴 수행 확인에 필요한 범위만 촬영하도록 안내해요.",
  },
  {
    title: "그룹 피드",
    desc: "내가 속한 방의 구성원만 내 인증 기록을 볼 수 있어요.",
  },
  {
    title: "보관 정책",
    desc: "수집 목적과 보관 기간을 명시하고, 삭제·탈퇴 요청을 지원해요.",
  },
];

function PrivacyPage() {
  const navigate = useNavigate();
  const [profilePublic, setProfilePublic] = useState(true);
  const [rankingPublic, setRankingPublic] = useState(true);

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
          <h1 className="text-[19px] font-bold text-black">개인정보 보호</h1>
        </header>

        <main className="flex-1 space-y-5 px-5 pb-10">
          <section>
            <p className="mb-2 text-[13px] font-bold text-[#4a4a4a]">
              공개 범위
            </p>
            <div className="divide-y divide-[#e7e3d8] rounded-[20px] border border-[#e7e3d8] bg-[#fefefe]">
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-black">
                    프로필 공개
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-[#6b7268]">
                    다른 사용자가 내 닉네임과 참여 기록을 볼 수 있어요.
                  </p>
                </div>
                <Toggle
                  checked={profilePublic}
                  onChange={setProfilePublic}
                  label="프로필 공개"
                />
              </div>
              <div className="flex items-center gap-3 px-5 py-4">
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-black">
                    개인 순위 공개
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-[#6b7268]">
                    같은 방 구성원에게 내 순위와 달성률을 보여줘요.
                  </p>
                </div>
                <Toggle
                  checked={rankingPublic}
                  onChange={setRankingPublic}
                  label="개인 순위 공개"
                />
              </div>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[13px] font-bold text-[#4a4a4a]">
              개인정보 최소화 원칙
            </p>
            <div className="divide-y divide-[#e7e3d8] rounded-[20px] border border-[#e7e3d8] bg-[#fefefe]">
              {minimizationRows.map((row) => (
                <div key={row.title} className="px-5 py-4">
                  <p className="text-[13px] font-bold text-black">
                    {row.title}
                  </p>
                  <p className="mt-1 text-[11px] font-medium leading-relaxed text-[#6b7268]">
                    {row.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <button
              type="button"
              className="h-[48px] w-full rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] text-[13px] font-bold text-black"
            >
              내 데이터 다운로드 요청
            </button>
            <button
              type="button"
              className="h-[48px] w-full rounded-[15px] border border-[#d9573b] bg-[#fefefe] text-[13px] font-bold text-[#d9573b]"
            >
              계정 삭제 요청
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default PrivacyPage;
