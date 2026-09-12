import type { SM2Input, SM2Output } from './types';

/**
 * SM-2 spaced repetition algorithm.
 * Modified initial ramp: 1d → 3d (instead of 1d → 6d) for faster IELTS feedback.
 */
export function sm2(input: SM2Input): SM2Output {
  const { quality, currentEaseFactor, currentInterval, currentRepetitions } = input;

  let newEF =
    currentEaseFactor +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, newEF);

  let newInterval: number;
  let newReps: number;

  if (quality < 3) {
    newReps = 0;
    newInterval = 0.00694; // ~10 minutes — show again this session
  } else {
    newReps = currentRepetitions + 1;
    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 3;
    } else {
      newInterval = Math.round(currentInterval * newEF);
    }
  }

  const nextReviewDate =
    Date.now() + newInterval * 24 * 60 * 60 * 1000;

  return {
    easeFactor: Math.round(newEF * 100) / 100,
    interval: newInterval,
    repetitions: newReps,
    nextReviewDate,
  };
}

/**
 * Map user interactions to SM-2 quality scores (0-5).
 */
export function flashcardQuality(
  knewIt: boolean,
  revealTimeMs: number,
): number {
  if (!knewIt) return 1;
  return revealTimeMs < 5000 ? 4 : 3;
}

export function quizQuality(
  correct: boolean,
  timedOut: boolean,
  timeRemainingPct: number,
): number {
  if (timedOut) return 0;
  if (!correct) return 1;
  if (timeRemainingPct > 60) return 5;
  if (timeRemainingPct > 30) return 4;
  return 3;
}
