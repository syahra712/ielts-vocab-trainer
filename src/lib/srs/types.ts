export interface SM2Input {
  quality: number;
  currentEaseFactor: number;
  currentInterval: number;
  currentRepetitions: number;
}

export interface SM2Output {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: number;
}

export const DEFAULT_CARD_STATE = {
  easeFactor: 2.5,
  interval: 0,
  repetitions: 0,
  totalCorrect: 0,
  totalWrong: 0,
  masteredAt: null,
} as const;

export const MASTERY_MIN_REPS = 5;
export const MASTERY_MIN_INTERVAL_DAYS = 21;
