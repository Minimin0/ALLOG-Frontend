import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { mockFeed, mockGroup } from "../../data/mockGroups";

const JOIN_INTERVAL_MS = 1800;

// 실제 참여자 데이터가 없어 mockFeed의 멤버 이름을 순서대로 재사용해
// "한 명씩 들어오는" 느낌을 시뮬레이션한다. 정원이 이 이름 수보다 많으면
// "멤버 N"으로 대체한다.
const NAME_POOL = mockFeed.filter((member) => member.name !== "나").map((member) => member.name);

function WaitingRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    title = mockGroup.title,
    capacity = mockGroup.totalMembers,
    code = mockGroup.inviteCode,
    existingCount = 0, // 그룹 만들기(0명) vs 모집중인 그룹에 참가(이미 있던 인원 수)
  } = location.state ?? {};

  // 참가로 들어온 경우 이미 모여있던 인원 뒤에 "나"를 이어붙여서 시작한다.
  const [members, setMembers] = useState(() => [
    ...NAME_POOL.slice(0, existingCount),
    "나",
  ]);
  const [copied, setCopied] = useState(false);
  const isFull = members.length >= capacity;

  // 정원이 찰 때까지 한 명씩 순서대로 합류하는 것처럼 보여준다.
  useEffect(() => {
    if (isFull) return undefined;
    const timer = setTimeout(() => {
      const arrivalIndex = members.length - 1; // "나" 다음으로 들어올 순번
      const nextName = NAME_POOL[arrivalIndex] ?? `멤버 ${members.length + 1}`;
      setMembers((prev) => [...prev, nextName]);
    }, JOIN_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [members, isFull]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // 클립보드 권한이 없는 환경일 수 있음 — 조용히 무시
    }
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-full max-w-[402px] flex-col bg-[#f7f6f3]">
        <header className="flex items-center gap-3 px-5 py-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="flex h-[43px] w-[43px] items-center justify-center rounded-[13px] bg-black"
          >
            <svg viewBox="0 0 24 24" className="h-[16px] w-[16px]" fill="none">
              <path
                d="M15 5l-7 7 7 7"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-[19px] font-bold text-black">대기실</h1>
        </header>

        <main className="flex-1 space-y-5 px-5 pb-10">
          <div className="rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] p-5 text-center">
            <p className="text-[12px] font-semibold text-[#4a4a4a]">초대 코드</p>
            <div className="mt-2 flex items-center justify-center gap-3">
              <span className="text-[22px] font-bold tracking-[4px] text-[#14453a]">
                {code}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-full border border-[#e7e3d8] bg-white px-3 py-1.5 text-[12px] font-bold text-[#4a4a4a]"
              >
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#e7e3d8] bg-[#edf2ec] p-5 text-center">
            <h2 className="text-[17px] font-bold text-black">{title}</h2>
            <p className="mt-1 text-[13px] font-semibold text-[#14453a]">
              {isFull ? "모든 인원이 모였어요!" : `${members.length}/${capacity}명 모였어요`}
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {Array.from({ length: capacity }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[21px] w-[21px] rounded-full transition-colors duration-300 ${
                    i < members.length ? "bg-[#14453a]" : "bg-[#e7e3d8]"
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[13px] font-bold text-[#4a4a4a]">참여한 멤버</p>
            <div className="space-y-2">
              {members.map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="animate-fade-slide-up flex items-center gap-3 rounded-[13px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0eee8] text-[13px] font-bold text-[#4a4a4a]">
                    {name === "나" ? "나" : name[0]}
                  </div>
                  <span className="text-[14px] font-semibold text-black">{name}</span>
                </div>
              ))}
            </div>
          </div>

          {!isFull ? (
            <p className="text-center text-[12px] font-medium text-[#6b7268]">
              {capacity - members.length}명 더 모이면 그룹이 개설돼요.
            </p>
          ) : null}
        </main>

        <div className="px-5 pb-8">
          <button
            type="button"
            disabled={!isFull}
            onClick={() => navigate(`/group/${mockGroup.id}`)}
            className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white disabled:opacity-40"
          >
            {isFull ? "그룹 시작하기" : "인원을 기다리는 중..."}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoomPage;
