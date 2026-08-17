// 두 workstream이 한 파일에서 부딪히지 않도록 상태를 소유자별로 갈라놓고,
// 이 파일은 기존 호출부가 그대로 동작하도록 남겨둔 합성 레이어다.
//
//   HeartState.js    hearts / completedHeartEvents / claimHeartEvent
//   ProfileState.js  nickname / birth / points / coachStyle / lifestyle + setter
//
// useAppState()가 돌려주는 객체의 모양과 provider가 없을 때 null인 성질까지
// 이전과 같으므로 화면 코드는 한 줄도 바뀌지 않는다.
import { useMemo } from "react";

import { HeartStateProvider, useHeartState } from "./HeartState";
import { ProfileStateProvider, useProfileState } from "./ProfileState";

export function AppStateProvider({ children }) {
  return (
    <ProfileStateProvider>
      <HeartStateProvider>{children}</HeartStateProvider>
    </ProfileStateProvider>
  );
}

export function useAppState() {
  const profile = useProfileState();
  const heart = useHeartState();
  return useMemo(() => {
    // provider 밖에서 호출되면 이전처럼 null을 준다. 부분적으로 채워진 객체를
    // 돌려주면 크래시가 엉뚱한 곳으로 옮겨갈 뿐이다.
    if (!profile || !heart) return null;
    return { ...profile, ...heart };
  }, [profile, heart]);
}

export { useHeartState, useProfileState };
