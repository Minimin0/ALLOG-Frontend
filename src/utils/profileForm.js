export function profileToEditForm(profile) {
  if (!profile) return null;
  const onboarding = profile.onboarding ?? {};
  return {
    nickname: profile.nickname ?? '',
    gender: profile.gender ?? null,
    birthDate: profile.birthDate ?? '',
    coachStyle: onboarding.coachStyle ?? 'supportive',
    averageSleepHours: onboarding.averageSleepHours ?? 7,
    exerciseDaysPerWeek: onboarding.exerciseDaysPerWeek ?? 0,
    mealsPerDay: onboarding.mealsPerDay ?? 0,
    preferredGroupDurationDays: onboarding.preferredGroupDurationDays ?? 7,
  };
}

export function editFormToProfilePatch(form) {
  return {
    nickname: form.nickname.trim(),
    gender: form.gender,
    birthDate: form.birthDate || null,
    onboarding: {
      coachStyle: form.coachStyle,
      averageSleepHours: form.averageSleepHours,
      exerciseDaysPerWeek: form.exerciseDaysPerWeek,
      mealsPerDay: form.mealsPerDay,
      preferredGroupDurationDays: form.preferredGroupDurationDays,
    },
  };
}
