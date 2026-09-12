const LEVEL_THRESHOLDS = [0, 50, 150, 300, 500, 800, 1200, 1800, 2500, 3500];

export function getLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXpForNextLevel(xp: number): {
  current: number;
  next: number;
  progress: number;
} {
  const level = getLevel(xp);
  const current = LEVEL_THRESHOLDS[level - 1] ?? 0;
  const next = LEVEL_THRESHOLDS[level] ?? current + 1000;
  const progress = (xp - current) / (next - current);
  return { current, next, progress: Math.min(1, progress) };
}

export function calculateXp(
  correct: boolean,
  streak: number,
  speedBonus: number = 0,
): number {
  if (!correct) return 0;
  let earned = 10 + speedBonus;
  if (streak >= 5) earned += 10;
  else if (streak >= 3) earned += 5;
  return earned;
}
