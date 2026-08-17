// Heart 전역 상태 — Group/Heart/Lifecycle workstream 소유.
//
// AppState.js에서 분리만 한 것이고 동작은 이전과 100% 동일하다.
// claimHeartEvent()의 로컬 +1은 서버가 진실원이어야 한다는 계약에 어긋나지만,
// 이 커밋은 기능 변경 0이 원칙이라 그대로 옮겼다. 서버 연동 교체는 별도 작업에서 한다.
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const KEYS = {
  hearts: "allog_hearts",
  heartEvents: "allog_completed_heart_events",
};
const Context = createContext(null);

export function HeartStateProvider({ children }) {
  const [hearts, setHeartsState] = useState(3);
  const [completedHeartEvents, setCompletedHeartEvents] = useState([]);
  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(KEYS.hearts),
      AsyncStorage.getItem(KEYS.heartEvents),
    ]).then(([storedHearts, storedEvents]) => {
      if (storedHearts !== null && Number.isFinite(Number(storedHearts)))
        setHeartsState(Number(storedHearts));
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          if (Array.isArray(parsedEvents)) setCompletedHeartEvents(parsedEvents);
        } catch {
          // Keep an empty completed list if an older value cannot be parsed.
        }
      }
    });
  }, []);
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
      hearts,
      completedHeartEvents,
      claimHeartEvent,
    }),
    [hearts, completedHeartEvents],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useHeartState() {
  return useContext(Context);
}
