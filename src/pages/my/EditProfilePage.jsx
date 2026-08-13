import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SleepTimeDial from "../../components/common/SleepTimeDial";

const genders = ["여성", "남성", "선택 안함"];
const coachStyles = [
  { name: "응원형", image: "/images/응원형.svg" },
  { name: "압박형", image: "/images/압박형.svg" },
  { name: "팩트형", image: "/images/팩트형.svg" },
  { name: "유머형", image: "/images/유머형.svg" },
];
const exerciseOptions = ["주 1회", "주 2회", "주 3회", "주 4회", "주 5회", "거의 안함"];
const waterOptions = ["0.5L 미만", "0.5L~1L", "1L~1.5L", "1.5L~2L", "2L 이상"];

function FieldChip({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[15px] border px-3.5 py-2.5 text-[12px] font-semibold ${
        active
          ? "border-[#14453a] bg-[#eaf4ec] text-black"
          : "border-[#e7e3d8] bg-[#fefefe] text-[#4a4a4a]"
      }`}
    >
      {children}
    </button>
  );
}

function EditProfilePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("민지");
  const [gender, setGender] = useState("여성");
  const [year, setYear] = useState("2000");
  const [month, setMonth] = useState("07");
  const [day, setDay] = useState("30");
  const [height, setHeight] = useState("165");
  const [weight, setWeight] = useState("50");
  const [coachStyle, setCoachStyle] = useState("응원형");
  const [exercise, setExercise] = useState("주 3회");
  const [water, setWater] = useState("1L~1.5L");
  const [sleepHours, setSleepHours] = useState(6);
  const [sleepMinutes, setSleepMinutes] = useState(30);

  const sleepValue = sleepHours + sleepMinutes / 60;

  const handleSleepChange = (value) => {
    setSleepHours(Math.floor(value));
    setSleepMinutes(Math.round((value % 1) * 60));
  };

  return (
    <div className="flex min-h-screen justify-center bg-[#f7f6f3]">
      <div className="flex min-h-screen w-[402px] flex-col overflow-x-hidden bg-[#f7f6f3]">
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
          <h1 className="text-[19px] font-bold text-black">프로필 편집</h1>
        </header>

        <main className="min-w-0 flex-1 space-y-6 px-5 pb-10">
          <div className="flex flex-col items-center pt-2">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-[#14453a] text-[22px] font-bold text-white">
              A
            </div>
            <button
              type="button"
              className="mt-3 text-[12px] font-semibold text-[#6b7268]"
            >
              프로필 사진 바꾸기
            </button>
          </div>

          <section>
            <div className="flex h-[52px] w-full items-center gap-3 rounded-[26px] border border-[#e7e3d8] bg-[#fefefe] px-5">
              <span className="shrink-0 text-[12px] font-semibold text-[#6b7268]">
                닉네임
              </span>
              <input
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
                className="flex-1 bg-transparent text-center text-[15px] font-semibold text-black outline-none"
              />
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none">
                <path
                  d="M4 20h4L18.5 9.5a2.121 2.121 0 0 0-3-3L5 17v3Z"
                  stroke="#4a4a4a"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </section>

          <section>
            <p className="mb-2 text-[13px] font-bold text-[#4a4a4a]">성별</p>
            <div className="grid grid-cols-3 gap-2">
              {genders.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setGender(item)}
                  className={`rounded-[15px] border py-3 text-[13px] font-semibold ${
                    gender === item
                      ? "border-2 border-[#14453a] bg-[#eaf4ec] text-black"
                      : "border-[#e7e3d8] bg-[#fefefe] text-black"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-2 text-[13px] font-bold text-[#4a4a4a]">
              생년월일
            </p>
            <div className="flex items-center gap-2">
              <input
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className="w-[70px] rounded-[8px] border border-[#e7e3d8] bg-[#fefefe] py-3 text-center text-[15px] font-medium text-black outline-none"
              />
              <span className="text-[13px] font-semibold text-[#4a4a4a]">
                년
              </span>
              <input
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="w-[48px] rounded-[8px] border border-[#e7e3d8] bg-[#fefefe] py-3 text-center text-[15px] font-medium text-black outline-none"
              />
              <span className="text-[13px] font-semibold text-[#4a4a4a]">
                월
              </span>
              <input
                value={day}
                onChange={(event) => setDay(event.target.value)}
                className="w-[48px] rounded-[8px] border border-[#e7e3d8] bg-[#fefefe] py-3 text-center text-[15px] font-medium text-black outline-none"
              />
              <span className="text-[13px] font-semibold text-[#4a4a4a]">
                일
              </span>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <section>
              <p className="mb-2 text-[13px] font-bold text-[#4a4a4a]">키</p>
              <div className="relative">
                <input
                  value={height}
                  onChange={(event) => setHeight(event.target.value)}
                  className="w-full rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] py-3.5 pl-4 pr-9 text-center text-[14px] font-semibold text-black outline-none"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#bababa]">
                  cm
                </span>
              </div>
            </section>
            <section>
              <p className="mb-2 text-[13px] font-bold text-[#4a4a4a]">
                몸무게
              </p>
              <div className="relative">
                <input
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                  className="w-full rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] py-3.5 pl-4 pr-9 text-center text-[14px] font-semibold text-black outline-none"
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] text-[#bababa]">
                  kg
                </span>
              </div>
            </section>
          </div>

          <section>
            <p className="mb-2 text-[13px] font-bold text-[#4a4a4a]">
              AI 코칭
            </p>
            <div className="grid grid-cols-2 gap-3">
              {coachStyles.map((item) => {
                const active = coachStyle === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setCoachStyle(item.name)}
                    className={`flex flex-col items-center gap-1 rounded-[15px] border px-3 py-3 ${
                      active
                        ? "border-2 border-[#14453a] bg-[#eaf4ec]"
                        : "border-[#e7e3d8] bg-[#fefefe]"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[44px] w-[44px] object-contain"
                    />
                    <span className="text-[13px] font-bold text-black">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="h-px bg-[#e7e3d8]" />

          <section className="space-y-3">
            <p className="text-center text-[15px] font-bold text-black">
              수면 시간
            </p>
            <div className="rounded-[15px] border border-[#e7e3d8] bg-[#fefefe] px-4 py-6">
              <div className="flex items-end justify-center gap-1">
                <span className="text-[33px] font-bold text-black">
                  {sleepHours}
                </span>
                <span className="mb-1 mr-3 text-[13px] text-[#696973]">시간</span>
                <span className="text-[33px] font-bold text-black">
                  {sleepMinutes}
                </span>
                <span className="mb-1 text-[13px] text-[#696973]">분</span>
              </div>
              <div className="mt-5">
                <SleepTimeDial value={sleepValue} onChange={handleSleepChange} />
              </div>
            </div>
          </section>

          <div className="h-px bg-[#e7e3d8]" />

          <section>
            <p className="mb-2 text-center text-[15px] font-bold text-black">
              운동 빈도
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {exerciseOptions.map((item) => (
                <FieldChip
                  key={item}
                  active={exercise === item}
                  onClick={() => setExercise(item)}
                >
                  {item}
                </FieldChip>
              ))}
            </div>
          </section>

          <div className="h-px bg-[#e7e3d8]" />

          <section>
            <p className="mb-2 text-center text-[15px] font-bold text-black">
              하루 물 섭취량
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {waterOptions.map((item) => (
                <FieldChip
                  key={item}
                  active={water === item}
                  onClick={() => setWater(item)}
                >
                  {item}
                </FieldChip>
              ))}
            </div>
          </section>

          <button
            type="button"
            onClick={() => navigate("/my")}
            className="w-full rounded-[27.5px] bg-[#14453a] py-4 text-[15px] font-bold text-white"
          >
            저장하기
          </button>
        </main>
      </div>
    </div>
  );
}

export default EditProfilePage;
