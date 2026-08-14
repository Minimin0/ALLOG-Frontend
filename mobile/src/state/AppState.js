import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEYS = {
  points: "allog_reward_points",
  coach: "allog_coach_style",
  lifestyle: "allog_lifestyle",
  hearts: "allog_hearts",
  heartEvents: "allog_completed_heart_events",
};
const DEFAULT_LIFESTYLE = {
  sleep: 6.5,
  exercise: "주 3회",
  meal: "2회",
  period: "14일",
};
const Context = createContext(null);

export function AppStateProvider({ children }) {
  const [points, setPointsState] = useState(1540);
  const [coachStyle, setCoachStyleState] = useState("응원형");
  const [lifestyle, setLifestyleState] = useState(DEFAULT_LIFESTYLE);
  const [hearts, setHeartsState] = useState(3);
  const [completedHeartEvents, setCompletedHeartEvents] = useState([]);
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(KEYS.points),
      AsyncStorage.getItem(KEYS.coach),
      AsyncStorage.getItem(KEYS.lifestyle),
      AsyncStorage.getItem(KEYS.hearts),
      AsyncStorage.getItem(KEYS.heartEvents),
    ]).then(
      ([
        storedPoints,
        storedCoach,
        storedLifestyle,
        storedHearts,
        storedEvents,
      ]) => {
        if (storedPoints !== null && Number.isFinite(Number(storedPoints)))
          setPointsState(Number(storedPoints));
        if (storedCoach) setCoachStyleState(storedCoach);
        if (storedHearts !== null && Number.isFinite(Number(storedHearts)))
          setHeartsState(Number(storedHearts));
        if (storedEvents) {
          try {
            const parsedEvents = JSON.parse(storedEvents);
            if (Array.isArray(parsedEvents))
              setCompletedHeartEvents(parsedEvents);
          } catch {
            // Keep an empty completed list if an older value cannot be parsed.
          }
        }
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
  const setLifestyle = (nextValues) => {
    const next = { ...lifestyle, ...nextValues };
    setLifestyleState(next);
    AsyncStorage.setItem(KEYS.lifestyle, JSON.stringify(next));
  };
  const claimHeartEvent = (eventId) => {
    if (completedHeartEvents.includes(eventId)) return false;
    const nextEvents = [...completedHeartEvents, eventId];
    const nextHearts = hearts + 1;
    setCompletedHeartEvents(nextEvents);
    setHeartsState(nextHearts);
    AsyncStorage.multiSet([
      [KEYS.heartEvents, JSON.stringify(nextEvents)],
      [KEYS.hearts, String(nextHearts)],
    ]);
    return true;
  };
  const value = useMemo(
    () => ({
      points,
      coachStyle,
      lifestyle,
      hearts,
      completedHeartEvents,
      setCoachStyle,
      setLifestyle,
      claimHeartEvent,
      deductPoints,
    }),
    [points, coachStyle, lifestyle, hearts, completedHeartEvents],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAppState() {
  return useContext(Context);
}
