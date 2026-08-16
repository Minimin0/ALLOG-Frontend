// 실행: node src/stores/onboardingStore.check.mjs
// 온보딩 라벨 → 백엔드 계약값 매핑 확인. 값이 하나라도 틀리면 POST /api/v1/users가 400이다.
import assert from 'node:assert/strict';
import { useOnboardingStore } from './onboardingStore.js';

const s = useOnboardingStore.getState();

s.patch({
  nickname: '  민지  ', gender: '여성', birth: '2000-07-30',
  interests: ['수분케어', '운동', '수분케어'], coachStyle: '팩트형',
  sleepH: 7, sleepM: 30, exercise: '주 3회', meal: '3회 이상', period: '14일',
});
let r = useOnboardingStore.getState().toCreateProfileRequest();
assert.deepEqual(r, {
  nickname: '민지', gender: 'female', birthDate: '2000-07-30',
  onboarding: {
    interestRoutines: ['hydration', 'exercise'], coachStyle: 'fact_based',
    averageSleepHours: 7.5, exerciseDaysPerWeek: 3, mealsPerDay: 3,
    preferredGroupDurationDays: 14,
  },
});

// 계약에 없는 키는 절대 실려서는 안 된다 (400 UNKNOWN_FIELD).
assert.deepEqual(Object.keys(r).sort(), ['birthDate', 'gender', 'nickname', 'onboarding']);
assert.deepEqual(Object.keys(r.onboarding).sort(), [
  'averageSleepHours', 'coachStyle', 'exerciseDaysPerWeek',
  'interestRoutines', 'mealsPerDay', 'preferredGroupDurationDays',
]);

// '선택 안함'이면 gender 필드 자체를 빼고, 생일이 없으면 birthDate도 뺀다.
useOnboardingStore.getState().patch({ gender: '선택 안함', birth: '', exercise: '거의 안함', meal: '먹지 않음', sleepM: 0, period: '7일' });
r = useOnboardingStore.getState().toCreateProfileRequest();
assert.ok(!('gender' in r) && !('birthDate' in r));
assert.equal(r.onboarding.exerciseDaysPerWeek, 0);
assert.equal(r.onboarding.mealsPerDay, 0);
assert.equal(r.onboarding.averageSleepHours, 7);
assert.equal(r.onboarding.preferredGroupDurationDays, 7);

// 소수점은 최대 1자리여야 한다 (0 또는 .5만 나온다).
for (const m of [0, 30]) {
  useOnboardingStore.getState().patch({ sleepM: m });
  const hours = useOnboardingStore.getState().toCreateProfileRequest().onboarding.averageSleepHours;
  assert.ok(Number.isInteger(hours * 10), `sleepM=${m} → ${hours}`);
}

console.log('onboarding mapping OK');
