import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const tabs = [
  { key: "verify", label: "인증" },
  { key: "ranking", label: "랭킹" },
  { key: "info", label: "정보" },
];

const members = [
  { name: "민지", isMe: true, done: false, waiting: true },
  { name: "지민", isMe: false, done: false, waiting: true },
  { name: "하민", isMe: false, done: true, time: "2시간 전" },
  { name: "편지", isMe: false, done: true, time: "3시간 전" },
  { name: "해주", isMe: false, done: true, time: "5시간 전" },
];

const ranking = [
  { rank: 1, name: "민지", reward: "1540P" },
  { rank: 2, name: "지민", reward: "1080P" },
  { rank: 3, name: "하민", reward: "560P" },
];

function GroupDetailPage() {
  const navigate = useNavigate();
  const { groupId = "water-evening" } = useParams();
  const [activeTab, setActiveTab] = useState("verify");
  const [joined, setJoined] = useState(false);

  const groupTitle = "하루 운동 30분";

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
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-bold text-black">
                {groupTitle}
              </h1>
              <span className="rounded-full bg-[#eaf4ec] px-2 py-0.5 text-[11px] font-bold text-[#14453a]">
                DAY 5
              </span>
            </div>
            <p className="mt-0.5 text-[11px] font-semibold text-[#4a4a4a]">
              오늘 2/5명 인증완료
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/group/invite")}
            className="flex items-center gap-1 rounded-full border border-[#e7e3d8] bg-[#fefefe] px-3 py-1.5 text-[11px] font-bold text-[#4a4a4a]"
          >
            🔗 7XQK92
          </button>
        </header>

        {/* 탭 밑줄은 컨테이너의 별도 border-b가 아니라 각 탭 자신의 border-b-2로 그린다
            (활성 = 검정, 비활성 = 연한 회색) → 두 border가 어긋나 밑줄이 구분선보다
            위에 떠 보이는 문제 없이 항상 한 줄로 붙는다. */}
        <div className="flex px-5">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className="flex flex-1 flex-col items-center pt-3"
              >
                <span
                  className={`border-b-2 pb-3 text-[14px] font-bold ${
                    active
                      ? "border-black text-black"
                      : "border-[#e7e3d8] text-[#bababa]"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <main className="flex-1 space-y-4 px-5 py-5 pb-10">
          {activeTab === "verify" && (
            <div className="grid grid-cols-2 gap-3">
              {members.map((member, i) => (
                <div
                  key={member.name}
                  className="animate-fade-slide-up flex flex-col justify-between rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-3"
                  style={{ minHeight: 176, animationDelay: `${i * 60}ms` }}
                >
                  {member.done ? (
                    <>
                      <div className="flex h-[110px] items-center justify-center rounded-[10px] bg-[#eaf4ec] text-[26px]">
                        ✅
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[12px] font-bold text-black">
                          {member.isMe ? "나" : member.name}
                        </span>
                        <span className="text-[10px] font-medium text-[#bababa]">
                          {member.time}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(`/group/${groupId}/feed`)}
                        className="mt-1 text-left text-[10px] font-semibold text-[#4a4a4a]"
                      >
                        댓글, 재인증 요청
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex h-[80px] items-center justify-center text-[13px] font-semibold text-[#4a4a4a]">
                        {member.isMe
                          ? "아직 오늘 인증을 안했어요."
                          : "인증을 기다리는 중이에요."}
                      </div>
                      <div className="mt-1 text-center text-[12px] font-bold text-black">
                        {member.isMe ? "나" : member.name}
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            member.isMe
                              ? `/group/${groupId}/verify/camera`
                              : `/group/${groupId}/feed`,
                          )
                        }
                        className="mt-2 rounded-full bg-black py-2 text-center text-[12px] font-bold text-white"
                      >
                        {member.isMe ? "인증하기" : "응원하기"}
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "ranking" && (
            <div className="space-y-4">
              <div className="flex items-end justify-center gap-3">
                {[
                  { rank: 2, name: "지민", medal: "🥈", h: 90 },
                  { rank: 1, name: "민지", medal: "🥇", h: 116 },
                  { rank: 3, name: "하민", medal: "🥉", h: 70 },
                ].map((item, i) => (
                  <div
                    key={item.rank}
                    className="animate-fade-slide-up flex flex-col items-center"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <span className="text-[26px]">{item.medal}</span>
                    <span className="mt-1 text-[12px] font-bold text-black">
                      {item.rank}위
                    </span>
                    <div
                      className="mt-2 w-[70px] rounded-t-[10px] bg-[#eaf4ec]"
                      style={{ height: item.h }}
                    />
                    <span className="mt-1 text-[12px] font-semibold text-[#4a4a4a]">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-4">
                <p className="mb-2 text-[13px] font-bold text-black">
                  랭킹 보상
                </p>
                {ranking.map((item) => (
                  <div
                    key={item.rank}
                    className="flex items-center justify-between py-1.5 text-[13px]"
                  >
                    <span className="font-semibold text-[#4a4a4a]">
                      {item.rank}위 {item.name}
                    </span>
                    <span className="font-bold text-black">
                      🪙 {item.reward}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate("/group/ranking-full")}
                className="w-full rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] py-3 text-center text-[13px] font-bold text-black"
              >
                전체 랭킹 보기
              </button>
            </div>
          )}

          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-4">
                <div className="flex items-center justify-between border-b border-[#e7e3d8] py-2.5 text-[13px]">
                  <span className="font-semibold text-[#4a4a4a]">그룹명</span>
                  <span className="font-bold text-black">{groupTitle}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#e7e3d8] py-2.5 text-[13px]">
                  <span className="font-semibold text-[#4a4a4a]">기간</span>
                  <span className="font-bold text-black">
                    8.10 ~ 8.24 (14일)
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 text-[13px]">
                  <span className="font-semibold text-[#4a4a4a]">
                    현재 인원
                  </span>
                  <span className="font-bold text-black">5명</span>
                </div>
              </div>

              <div className="flex justify-between rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-4">
                {members.map((member) => (
                  <div
                    key={member.name}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#eaf4ec] text-[13px] font-bold text-[#14453a]">
                      {member.name[0]}
                    </div>
                    <span className="text-[10px] font-semibold text-[#4a4a4a]">
                      {member.isMe ? "나" : member.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#4a4a4a]">
                    우리 그룹 공동 성공률
                  </span>
                  <span className="text-[16px] font-bold text-black">
                    60%
                  </span>
                </div>
                <div className="relative mt-3 h-[9px] w-full rounded-full bg-[#f0eee8]">
                  <div
                    className="h-full rounded-full bg-[#14453a]"
                    style={{ width: "60%" }}
                  />
                  <div
                    className="absolute top-[-4px] h-[17px] w-[2px] bg-[#d9573b]"
                    style={{ left: "80%" }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[#4a4a4a]">2/5명 완료</span>
                  <span className="text-[#d9573b]">그룹 목표 80%</span>
                </div>
              </div>

              <div className="flex rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] py-4">
                <div className="flex-1 text-center">
                  <p className="text-[13px] font-semibold text-[#4a4a4a]">
                    남은 기간
                  </p>
                  <p className="mt-1 text-[15px] font-bold text-black">D-2</p>
                </div>
                <div className="w-px bg-[#e7e3d8]" />
                <div className="flex-1 text-center">
                  <p className="text-[13px] font-semibold text-[#4a4a4a]">
                    내 순위
                  </p>
                  <p className="mt-1 text-[15px] font-bold text-black">1위</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {!joined && (
          <div className="sticky bottom-0 border-t border-[#e7e3d8] bg-[#fefefe] px-5 py-4">
            <button
              type="button"
              onClick={() => {
                setJoined(true);
                navigate(`/group/join-complete/${groupId}`);
              }}
              className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white"
            >
              그룹 참가하기 (❤️ 1개 사용)
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate("/ai-coach")}
          aria-label="AI 코칭"
          className="fixed bottom-24 right-[calc(50%-181px)] flex h-[54px] w-[54px] flex-col items-center justify-center rounded-full bg-black text-[10px] font-bold text-white shadow-[0_6px_14px_rgba(0,0,0,0.25)]"
        >
          <span className="text-[16px]">🤖</span>
          AI 코칭
        </button>
      </div>
    </div>
  );
}

export default GroupDetailPage;
