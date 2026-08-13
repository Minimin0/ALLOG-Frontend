import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = ["수분케어", "식사", "운동", "수면"];
const durations = ["7일", "14일", "30일"];
const MAX_VERIFICATION_TIMES = 5;

function CreateGroupPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("14일");
  const [capacity, setCapacity] = useState(5);
  const [visibility, setVisibility] = useState("public");
  const [verificationTimes, setVerificationTimes] = useState([
    { start: "07:00", end: "22:00" },
  ]);

  const canSubmit = category && name.trim().length > 0;

  const addVerificationTime = () => {
    setVerificationTimes((prev) =>
      prev.length >= MAX_VERIFICATION_TIMES
        ? prev
        : [...prev, { start: "07:00", end: "22:00" }],
    );
  };

  const updateVerificationTime = (index, field, value) => {
    setVerificationTimes((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)),
    );
  };

  const removeVerificationTime = (index) => {
    setVerificationTimes((prev) => prev.filter((_, i) => i !== index));
  };

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
          <h1 className="text-[19px] font-bold text-black">그룹 만들기</h1>
        </header>

        <main className="flex-1 space-y-6 px-5 pb-8">
          <section>
            <p className="mb-2 text-[15px] font-bold text-black">
              카테고리 선택
            </p>
            <div className="flex flex-wrap gap-2">
              {categories.map((item) => {
                const active = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`rounded-full border px-4 py-2 text-[13px] font-semibold ${
                      active
                        ? "border-[#14453a] bg-[#eaf4ec] text-black"
                        : "border-[#e7e3d8] bg-[#fefefe] text-[#4a4a4a]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="mb-2 text-[15px] font-bold text-black">그룹명</p>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="매일 물 2L 마시기"
              className="w-full rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-4 text-[14px] text-black outline-none placeholder:text-[#bababa]"
            />
          </section>

          <section>
            <p className="mb-2 text-[15px] font-bold text-black">진행기간</p>
            <div className="grid grid-cols-3 gap-3">
              {durations.map((item) => {
                const active = duration === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDuration(item)}
                    className={`rounded-[15px] border py-3 text-[14px] font-bold ${
                      active
                        ? "border-[#14453a] bg-[#eaf4ec] text-black"
                        : "border-[#e7e3d8] bg-[#fefefe] text-[#4a4a4a]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <p className="mb-2 text-[15px] font-bold text-black">참여 인원</p>
            <div className="flex items-center justify-between rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-4">
              <button
                type="button"
                onClick={() => setCapacity((prev) => Math.max(2, prev - 1))}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f0eee8] text-[16px] font-bold text-black"
              >
                -
              </button>
              <span className="text-[16px] font-bold text-black">
                {capacity}명
              </span>
              <button
                type="button"
                onClick={() => setCapacity((prev) => Math.min(10, prev + 1))}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f0eee8] text-[16px] font-bold text-black"
              >
                +
              </button>
            </div>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[15px] font-bold text-black">인증 시간 설정</p>
              <button
                type="button"
                onClick={addVerificationTime}
                disabled={verificationTimes.length >= MAX_VERIFICATION_TIMES}
                aria-label="인증 시간 추가"
                className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-black text-[15px] font-bold text-white disabled:opacity-30"
              >
                +
              </button>
            </div>
            <div className="space-y-2">
              {verificationTimes.map((slot, index) => (
                <div
                  key={index}
                  className="rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#6b7268]">
                      {index === 0 ? "" : `추가 ${index}`}
                    </span>
                    {verificationTimes.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeVerificationTime(index)}
                        aria-label="인증 시간 삭제"
                        className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#f0eee8] text-[12px] font-bold text-[#6b7268]"
                      >
                        ×
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 items-center gap-2">
                      <span className="shrink-0 text-[11px] font-semibold text-[#4a4a4a]">
                        시작
                      </span>
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(event) =>
                          updateVerificationTime(index, "start", event.target.value)
                        }
                        className="w-full bg-transparent text-[14px] font-semibold text-black outline-none"
                      />
                    </div>
                    <span className="shrink-0 text-[12px] text-[#bababa]">~</span>
                    <div className="flex flex-1 items-center gap-2">
                      <span className="shrink-0 text-[11px] font-semibold text-[#4a4a4a]">
                        마감
                      </span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(event) =>
                          updateVerificationTime(index, "end", event.target.value)
                        }
                        className="w-full bg-transparent text-[14px] font-semibold text-black outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 text-[15px] font-bold text-black">공개 범위</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility("public")}
                className={`rounded-[15px] border px-3 py-4 text-center ${
                  visibility === "public"
                    ? "border-2 border-[#14453a] bg-[#eaf4ec]"
                    : "border-[#e7e3d8] bg-[#fefefe]"
                }`}
              >
                <p className="text-[14px] font-bold text-black">공개</p>
                <p className="mt-1 text-[11px] font-medium text-[#4a4a4a]">
                  누구나 참여할 수 있어요.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`rounded-[15px] border px-3 py-4 text-center ${
                  visibility === "private"
                    ? "border-2 border-[#14453a] bg-[#eaf4ec]"
                    : "border-[#e7e3d8] bg-[#fefefe]"
                }`}
              >
                <p className="text-[14px] font-bold text-black">비공개</p>
                <p className="mt-1 text-[11px] font-medium text-[#4a4a4a]">
                  초대한 사람만 참여할 수 있어요.
                </p>
              </button>
            </div>
          </section>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => navigate("/group/created")}
            className="w-full rounded-[27.5px] bg-black py-4 text-[15px] font-bold text-white disabled:opacity-40"
          >
            그룹 만들기
          </button>
        </main>
      </div>
    </div>
  );
}

export default CreateGroupPage;
