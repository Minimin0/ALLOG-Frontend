// onboardingStore — 온보딩 4단계 입력을 모아 POST /api/v1/users 한 번으로 보낸다.
//
// 프로필/온보딩 enum은 lower_snake_case다 (그룹 도메인의 UPPERCASE와 다르다).
// 계약에 없는 key를 하나라도 보내면 400 UNKNOWN_FIELD이므로 화면의 키·몸무게는 전송하지 않는다.
import { create } from "zustand";

const GENDER = { 여성: "female", 남성: "male" }; // '선택 안함'은 필드를 아예 빼서 보낸다
const INTEREST = { 수분케어: "hydration", 운동: "exercise", 식사: "meal", 수면: "sleep" };
const COACH_STYLE = {
  응원형: "supportive",
  압박형: "pressuring",
  팩트형: "fact_based",
  유머형: "humorous",
};
const EXERCISE_DAYS = {
  "주 1회": 1,
  "주 2회": 2,
  "주 3회": 3,
  "주 4회": 4,
  "주 5회": 5,
  "거의 안함": 0,
};
const MEALS = { "먹지 않음": 0, "1회": 1, "2회": 2, "3회 이상": 3 };

// 생년월일 칸은 숫자 키보드로 열리고 서버는 ISO(yyyy-MM-dd)만 파싱한다. 하이픈을
// 직접 치는 사람이 드물어 20000730처럼 들어오는데, 그대로 보내면 온보딩을 다 끝낸
// 마지막 단계에서 400으로 되돌아온다. 입력하는 동안 하이픈을 대신 넣어준다.
export function formatBirthInput(raw) {
  const digits = String(raw ?? "").replace(/[^0-9]/g, "").slice(0, 8);
  if (digits.length <= 4) return digits;
  if (digits.length <= 6) return digits.slice(0, 4) + "-" + digits.slice(4);
  return digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6);
}

// 달력에 실제로 있는 날짜이고 미래가 아닐 때만 ISO 문자열을 돌려준다. 1111-22-33처럼
// 자릿수만 맞는 값도 서버 LocalDate에서 깨지므로 여기서 걸러 화면이 먼저 알려준다.
export function toIsoBirthDate(value) {
  const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(String(value ?? "").trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const at = Date.UTC(year, month - 1, day);
  const date = new Date(at);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  const now = new Date();
  if (year * 10000 + month * 100 + day > now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()) return null;
  return m[1] + "-" + m[2] + "-" + m[3];
}

export const useOnboardingStore = create((set, get) => ({
  nickname: "",
  gender: "여성",
  birth: "",
  interests: [],
  coachStyle: "응원형",
  sleepH: 6,
  sleepM: 30,
  exercise: null,
  meal: null,
  period: null,

  patch: (values) => set(values),
  reset: () =>
    set({
      nickname: "",
      gender: "여성",
      birth: "",
      interests: [],
      coachStyle: "응원형",
      sleepH: 6,
      sleepM: 30,
      exercise: null,
      meal: null,
      period: null,
    }),

  // 화면 라벨(한국어) → 백엔드 계약값. 여기가 유일한 변환 지점이다.
  toCreateProfileRequest: () => {
    const s = get();
    const request = {
      nickname: s.nickname.trim(),
      onboarding: {
        interestRoutines: [...new Set(s.interests.map((label) => INTEREST[label]).filter(Boolean))],
        coachStyle: COACH_STYLE[s.coachStyle] ?? "supportive",
        averageSleepHours: s.sleepH + (s.sleepM === 30 ? 0.5 : 0),
        exerciseDaysPerWeek: EXERCISE_DAYS[s.exercise] ?? 0,
        mealsPerDay: MEALS[s.meal] ?? 0,
        preferredGroupDurationDays: Number.parseInt(s.period ?? "7", 10),
      },
    };
    if (GENDER[s.gender]) request.gender = GENDER[s.gender];
    const birthDate = toIsoBirthDate(s.birth);
    if (birthDate) request.birthDate = birthDate;
    return request;
  },
}));

export default useOnboardingStore;
