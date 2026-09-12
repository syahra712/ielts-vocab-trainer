import type { Topic } from './word';

export type StudyMode = 'flashcard' | 'fill-gap' | 'speed';

export interface CardState {
  wordSlug: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: number;
  totalCorrect: number;
  totalWrong: number;
  lastReviewedAt: number;
  masteredAt: number | null;
  topic: Topic;
}

export interface ReviewLog {
  wordSlug: string;
  topic: Topic;
  mode: StudyMode;
  quality: number;
  correct: boolean;
  responseTimeMs: number;
  xpEarned: number;
  timestamp: number;
}

export type SessionStatus =
  | 'loading'
  | 'active'
  | 'answered'
  | 'transitioning'
  | 'complete';

export interface SessionResult {
  wordSlug: string;
  correct: boolean;
  quality: number;
  responseTimeMs: number;
  xpEarned: number;
}
