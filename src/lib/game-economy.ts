const OVR_BASELINE = 75;

export function ovrMultiplier(ovr: number): number {
  return 1 + (ovr - OVR_BASELINE) / 200;
}

const BASE_GOAL_REWARD = 10;
const STREAK_BONUS = 2;
const MAX_STREAK_BONUS_INDEX = 5;

export function currencyForGoal(streakIndex: number): number {
  return BASE_GOAL_REWARD + Math.min(streakIndex, MAX_STREAK_BONUS_INDEX) * STREAK_BONUS;
}

export function unlockCostFor(price: number): number {
  return Math.round(price / 3);
}
