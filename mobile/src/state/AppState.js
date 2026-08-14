import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEYS = { points: "allog_reward_points", coach: "allog_coach_style" };
const Context = createContext(null);

export function AppStateProvider({ children }) {
  const [points, setPointsState] = useState(1540);
  const [coachStyle, setCoachStyleState] = useState("응원형");
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(KEYS.points),
      AsyncStorage.getItem(KEYS.coach),
    ]).then(([storedPoints, storedCoach]) => {
      if (storedPoints !== null && Number.isFinite(Number(storedPoints)))
        setPointsState(Number(storedPoints));
      if (storedCoach) setCoachStyleState(storedCoach);
    });
  }, []);
  const setCoachStyle = (value) => {
    setCoachStyleState(value);
    AsyncStorage.setItem(KEYS.coach, value);
  };
  const deductPoints = (amount) => {
    const next = Math.max(0, points - amount);
    setPointsState(next);
    AsyncStorage.setItem(KEYS.points, String(next));
    return next;
  };
  const value = useMemo(
    () => ({ points, coachStyle, setCoachStyle, deductPoints }),
    [points, coachStyle],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppState() {
  return useContext(Context);
}
