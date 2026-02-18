export const hazardWeights: Record<string, number> = {
  MISSING_HARD_HAT: 2,
  MISSING_VEST: 2,
  NO_FALL_PROTECTION: 4,
  LADDER_MISUSE: 3,
  OPEN_TRENCH: 4,
  IMPROPER_PPE: 3,
};

export function calculateRiskScore(flags: string[], priorOpenHotItems: number): number {
  const flagsScore = flags.reduce((sum, flag) => sum + (hazardWeights[flag] ?? 1), 0);
  const hotItemModifier = Math.min(priorOpenHotItems, 5);
  return Math.min(10, Math.max(1, Math.round((flagsScore + hotItemModifier) / 2)));
}
