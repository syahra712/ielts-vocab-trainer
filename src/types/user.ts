import type { Topic } from './word';

export interface UserSettings {
  dailyGoal: number;
  theme: 'system' | 'light' | 'dark';
  soundEnabled: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  createdAt: number;
  settings: UserSettings;
}

export interface TopicMasteryEntry {
  total: number;
  mastered: number;
  inProgress: number;
}

export interface AggregateStats {
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
  totalWordsLearned: number;
  totalReviews: number;
  topicMastery: Partial<Record<Topic, TopicMasteryEntry>>;
}

export interface DailyStats {
  date: string;
  wordsReviewed: number;
  wordsCorrect: number;
  wordsNew: number;
  xpEarned: number;
  sessionsCompleted: number;
  studyTimeSeconds: number;
}
