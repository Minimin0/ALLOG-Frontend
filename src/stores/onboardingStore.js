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
    if (s.birth) request.birthDate = s.birth;
    return request;
  },
}));

export default useOnboardingStore;
