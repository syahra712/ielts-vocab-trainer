export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function calculateStreak(
  lastStudyDate: string | null,
  currentStreak: number,
): { newStreak: number; isNewDay: boolean } {
  const today = getTodayDateString();

  if (lastStudyDate === today) {
    return { newStreak: currentStreak, isNewDay: false };
  }

  if (!lastStudyDate) {
    return { newStreak: 1, isNewDay: true };
  }

  const last = new Date(lastStudyDate + 'T00:00:00');
  const now = new Date(today + 'T00:00:00');
  const diffDays = Math.round(
    (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 1) {
    return { newStreak: currentStreak + 1, isNewDay: true };
  }

  return { newStreak: 1, isNewDay: true };
}
