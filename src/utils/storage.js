// storage utility

const COACH_STYLE_KEY = "allog_coach_style";

export function getCoachStyle() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(COACH_STYLE_KEY);
  } catch {
    return null;
  }
}

export function setCoachStyle(style) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COACH_STYLE_KEY, style);
  } catch {
    // ignore storage errors (e.g. private mode)
  }
}

const REWARD_POINTS_KEY = "allog_reward_points";
const DEFAULT_REWARD_POINTS = 1540;

export function getRewardPoints() {
  if (typeof window === "undefined") return DEFAULT_REWARD_POINTS;
  try {
    const stored = window.localStorage.getItem(REWARD_POINTS_KEY);
    if (stored === null) return DEFAULT_REWARD_POINTS;
    const parsed = Number(stored);
    return Number.isFinite(parsed) ? parsed : DEFAULT_REWARD_POINTS;
  } catch {
    return DEFAULT_REWARD_POINTS;
  }
}

export function setRewardPoints(points) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REWARD_POINTS_KEY, String(points));
  } catch {
    // ignore storage errors (e.g. private mode)
  }
}

export function deductRewardPoints(amount) {
  const next = Math.max(0, getRewardPoints() - amount);
  setRewardPoints(next);
  return next;
}
