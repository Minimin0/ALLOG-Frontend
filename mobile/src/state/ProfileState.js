// 프로필 / 리워드 포인트 전역 상태 — Auth/Onboarding/Profile/Stats workstream 소유.
//
// AppState.js에서 이동만 했고 동작은 그대로다. 포인트를 깎던 deductPoints는
// 서버에 교환 API가 없어 리워드 상세에서 제거됐고, 남은 호출부가 없어 함께 뺐다.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEYS = {
  nickname: "allog_nickname",
  birth: "allog_birth",
  points: "allog_reward_points",
  coach: "allog_coach_style",
  lifestyle: "allog_lifestyle",
};
const DEFAULT_LIFESTYLE = {
  sleep: 6.5,
  exercise: "주 3회",
  meal: "2회",
  period: "14일",
};
const Context = createContext(null);

export function ProfileStateProvider({ children }) {
  const [nickname, setNicknameState] = useState("민지");
  const [birth, setBirthState] = useState("2000-07-30");
  const [points, setPointsState] = useState(1540);
  const [coachStyle, setCoachStyleState] = useState("응원형");
  const [lifestyle, setLifestyleState] = useState(DEFAULT_LIFESTYLE);
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(KEYS.nickname),
      AsyncStorage.getItem(KEYS.birth),
      AsyncStorage.getItem(KEYS.points),
      AsyncStorage.getItem(KEYS.coach),
      AsyncStorage.getItem(KEYS.lifestyle),
    ]).then(
      ([
        storedNickname,
        storedBirth,
        storedPoints,
        storedCoach,
        storedLifestyle,
      ]) => {
        if (storedNickname?.trim()) setNicknameState(storedNickname.trim());
        if (storedBirth) setBirthState(storedBirth);
        if (storedPoints !== null && Number.isFinite(Number(storedPoints)))
          setPointsState(Number(storedPoints));
        if (storedCoach) setCoachStyleState(storedCoach);
        if (storedLifestyle) {
          try {
            setLifestyleState({
              ...DEFAULT_LIFESTYLE,
              ...JSON.parse(storedLifestyle),
            });
          } catch {
            // Keep safe defaults if an older local value cannot be parsed.
          }
        }
      },
    );
  }, []);
  const setNickname = (value) => {
    const next = value.trim();
    if (!next) return false;
    setNicknameState(next);
    AsyncStorage.setItem(KEYS.nickname, next);
    return true;
  };
  const setBirth = (value) => {
    setBirthState(value);
    AsyncStorage.setItem(KEYS.birth, value);
  };
  const setCoachStyle = (value) => {
    setCoachStyleState(value);
    AsyncStorage.setItem(KEYS.coach, value);
  };
  const setLifestyle = (nextValues) => {
    const next = { ...lifestyle, ...nextValues };
    setLifestyleState(next);
    AsyncStorage.setItem(KEYS.lifestyle, JSON.stringify(next));
  };
  const value = useMemo(
    () => ({
      nickname,
      birth,
      points,
      coachStyle,
      lifestyle,
      setNickname,
      setBirth,
      setCoachStyle,
      setLifestyle,
    }),
    [nickname, birth, points, coachStyle, lifestyle],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useProfileState() {
  return useContext(Context);
}
