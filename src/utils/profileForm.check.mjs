import assert from 'node:assert/strict';
import { editFormToProfilePatch, profileToEditForm } from './profileForm.js';

assert.equal(profileToEditForm(null), null);
const form = profileToEditForm({ nickname: '  ALLOG  ', gender: null, birthDate: null });
assert.deepEqual(editFormToProfilePatch(form), {
  nickname: 'ALLOG', gender: null, birthDate: null,
  onboarding: {
    coachStyle: 'supportive', averageSleepHours: 7, exerciseDaysPerWeek: 0,
    mealsPerDay: 0, preferredGroupDurationDays: 7,
  },
});
console.log('profile edit null hydration and patch contract OK');
