// Heart 전역 상태 — Group/Heart/Lifecycle workstream 소유.
//
// 하트 잔액의 진실원은 GET /api/v1/users/me/stats이고, 화면은 그 값을 보여준다.
// 여기 남은 상태는 HW 구현이 아직 참조하는 로컬 캐시일 뿐이며 하트를 만들어내지
// 않는다. claimHeartEvent는 이벤트 완료 표시만 하고 잔액은 건드리지 않는다.
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
    setCompletedHeartEvents(nextEvents);
    AsyncStorage.setItem(KEYS.heartEvents, JSON.stringify(nextEvents));
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
