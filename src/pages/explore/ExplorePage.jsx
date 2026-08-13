import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../../components/layout/BottomNav";
import JoinGroupModal from "../../components/group/JoinGroupModal";
import FilterModal from "../../components/explore/FilterModal";

const categories = ["전체", "수분케어", "식사", "운동", "수면"];

const aiPick = {
  id: "ai-water",
  title: "매일 물 1.5L 마시기",
  members: "4/5명",
  period: "8.10 ~ 8.24 (14일)",
  reward: "1500",
  status: "모집중",
};

const groups = [
  {
    id: "water-evening",
    title: "저녁형 수분 루틴",
    members: "3/5명",
    period: "8.12 ~ 8.26 (14일)",
    duration: "14일",
    reward: "1200",
    full: false,
    status: "모집중",
  },
  {
    id: "water-morning",
    title: "아침 물 챌린지",
    members: "4/5명",
    period: "8.11 ~ 8.18 (7일)",
    duration: "7일",
    reward: "900",
    full: false,
    status: "모집중",
  },
  {
    id: "water-worker",
    title: "직장인 수분 루틴",
    members: "5/5명",
    period: "8.15 ~ 9.14 (30일)",
    duration: "30일",
    reward: "2000",
    full: true,
    status: "정원 충족",
  },
];

function ExplorePage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("수분케어");
  const [joinTarget, setJoinTarget] = useState(null);
  const [bouncing, setBouncing] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const [durationFilter, setDurationFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("전체");
  const [appliedDuration, setAppliedDuration] = useState("전체");
  const [appliedStatus, setAppliedStatus] = useState("전체");

  const hasActiveFilter = appliedDuration !== "전체" || appliedStatus !== "전체";

  const filteredGroups = useMemo(
    () =>
      groups.filter((group) => {
        const matchesDuration =
          appliedDuration === "전체" || group.duration === appliedDuration;
        const matchesStatus =
          appliedStatus === "전체" || group.status === appliedStatus;
        return matchesDuration && matchesStatus;
      }),
    [appliedDuration, appliedStatus],
  );

  const openFilter = () => {
    setDurationFilter(appliedDuration);
    setStatusFilter(appliedStatus);
    setFilterOpen(true);
  };

  const handleApplyFilter = () => {
    setAppliedDuration(durationFilter);
    setAppliedStatus(statusFilter);
    setFilterOpen(false);
  };

  const handleResetFilter = () => {
    setDurationFilter("전체");
    setStatusFilter("전체");
  };

  const handleConfirmJoin = () => {
    const group = joinTarget;
    setJoinTarget(null);
    navigate(`/group/join-complete/${group.id}`, {
      state: { title: group.title },
    });
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-[402px] flex-col bg-[#f7f6f3]">
        <header className="flex items-center justify-between px-[30px] pt-4">
          <h1 className="text-[28px] font-bold text-black">탐색</h1>
          <button
            type="button"
            onClick={() => setBouncing(true)}
            aria-label="AI 코치"
            className="h-[54px] w-[54px]"
          >
            <img
              src="/images/응원형.svg"
              alt="AI 코치"
              className={`h-full w-full object-contain ${bouncing ? "bounce-once" : ""}`}
              onAnimationEnd={() => {
                setBouncing(false);
                navigate("/ai-coach");
              }}
            />
          </button>
        </header>

        <main className="flex-1 space-y-4 px-[30px] pb-8 pt-5">
          <div className="flex items-center gap-2">
            <div className="flex h-[45px] flex-1 items-center gap-2 rounded-[14px] border border-[#e7e3d8] bg-[#fefefe] px-4">
              <img src="/images/검색.svg" alt="" className="h-[16px] w-[16px]" />
              <input
                type="text"
                placeholder="그룹 또는 루틴 검색..."
                className="w-full bg-transparent text-[14px] text-[#6b7268] outline-none placeholder:text-[#6b7268]"
              />
            </div>
            <button
              type="button"
              onClick={openFilter}
              aria-label="필터"
              className="relative flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[14px] bg-[#14453a]"
            >
              <img src="/images/필터.svg" alt="" className="h-[18px] w-[18px]" />
              {hasActiveFilter ? (
                <span className="absolute right-[6px] top-[6px] h-[8px] w-[8px] rounded-full bg-[#d9573b]" />
              ) : null}
            </button>
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            {categories.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-[10px] border px-4 py-2.5 text-[13px] font-semibold ${
                    active
                      ? "border-black bg-[#14453a] text-[#fefefe]"
                      : "border-[#e7e3d8] bg-[#fefefe] text-[#6b7268]"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <div className="w-full rounded-[18px] border border-[#e7e3d8] bg-[#edf2ec] p-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate(`/explore/group/${aiPick.id}`)}
                className="flex-1 text-left"
              >
                <p className="text-[11px] opacity-75">
                  <span className="font-bold text-black">AI 추천 </span>
                  <span className="font-semibold text-[#14453a]">
                    곧 마감돼요, 자리 1개 남았어요
                  </span>
                </p>
                <p className="mt-2 text-[16px] font-bold text-black">
                  {aiPick.title}
                </p>
                <div className="mt-2 flex items-center gap-2.5 text-[12px]">
                  <span className="font-semibold text-black">{aiPick.members}</span>
                  <span className="font-medium text-black">
                    <span className="text-[#d9573b]">♥</span> 1개
                  </span>
                  <span className="font-bold text-black">{aiPick.status}</span>
                  <span className="ml-2 flex gap-1 text-[8px] text-[#bababa]">
                    ● ● ● ●
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setJoinTarget(aiPick)}
                className="shrink-0 rounded-[12px] bg-[#14453a] px-3.5 py-2 text-[12px] font-bold text-[#fefefe]"
              >
                참가
              </button>
            </div>
          </div>

          <div>
            <p className="mb-2.5 text-[13px] font-bold text-black">
              모집중인 그룹
            </p>
            {filteredGroups.length === 0 ? (
              <p className="rounded-[16px] border border-[#e7e3d8] bg-[#fefefe] p-4 text-center text-[13px] text-[#6b7268]">
                조건에 맞는 그룹이 없어요.
              </p>
            ) : (
            <div className="space-y-3">
              {filteredGroups.map((group) => (
                <div
                  key={group.id}
                  className={`flex w-full items-center justify-between rounded-[16px] p-4 text-left ${
                    group.full ? "bg-[#fefefe]" : "border border-[#e7e3d8] bg-[#fefefe]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/explore/group/${group.id}`)}
                    className="flex-1 text-left"
                  >
                    <p
                      className={`text-[15px] font-bold ${
                        group.full ? "text-[#bababa]" : "text-[#1f2a24]"
                      }`}
                    >
                      {group.title}
                    </p>
                    <p
                      className={`mt-1.5 text-[12px] ${
                        group.full ? "text-[#bababa]" : "text-[#6b7268]"
                      }`}
                    >
                      {group.members}{" "}
                      <span className={group.full ? "" : "text-[#d9573b]"}>♥</span>{" "}
                      1개 필요
                    </p>
                  </button>
                  <button
                    type="button"
                    disabled={group.full}
                    onClick={() => setJoinTarget(group)}
                    className={`shrink-0 rounded-[12px] px-3.5 py-2 text-[12px] font-bold ${
                      group.full
                        ? "bg-[#f9ddd7] text-[#d9573b] opacity-40"
                        : "bg-[#edf2ec] text-[#1f3d2b]"
                    }`}
                  >
                    {group.full ? "마감" : "참가"}
                  </button>
                </div>
              ))}
            </div>
            )}
          </div>

          <div className="pt-1 text-center">
            <p className="text-[13px] font-medium text-[#6b7268]">
              하고싶은 루틴이 없다면?
            </p>
            <button
              type="button"
              onClick={() => navigate("/group/create")}
              className="mt-3 h-[50px] w-full rounded-[27.5px] bg-[#14453a] text-[15px] font-bold text-white"
            >
              직접 그룹 만들기
            </button>
          </div>
        </main>

        <BottomNav />
      </div>

      <JoinGroupModal
        group={joinTarget}
        onClose={() => setJoinTarget(null)}
        onConfirm={handleConfirmJoin}
      />

      <FilterModal
        open={filterOpen}
        duration={durationFilter}
        status={statusFilter}
        onChangeDuration={setDurationFilter}
        onChangeStatus={setStatusFilter}
        onReset={handleResetFilter}
        onClose={() => setFilterOpen(false)}
        onApply={handleApplyFilter}
      />
    </div>
  );
}

export default ExplorePage;
