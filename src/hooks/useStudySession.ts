'use client';

import { useState, useCallback, useRef } from 'react';
import type { Word } from '@/types/word';
import type { CardState, StudyMode } from '@/types/session';
import { sm2, flashcardQuality, quizQuality } from '@/lib/srs/sm2';
import { DEFAULT_CARD_STATE } from '@/lib/srs/types';
import { calculateXp } from '@/lib/gamification/xp';
import { shuffle } from '@/lib/utils/shuffle';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  updateCardState,
  addReviewLog,
  updateDailyStats,
  updateAggregateStats,
} from '@/lib/firebase/firestore';
import { getTodayDateString } from '@/lib/gamification/streaks';
import { increment } from 'firebase/firestore';

const ROUND_SIZE = 5;

interface SessionWord {
  word: Word;
  cardState: CardState;
}

export function useStudySession(
  words: Word[],
  cardStates: Map<string, CardState>,
  mode: StudyMode,
) {
  const { user } = useAuth();
  const [queue, setQueue] = useState<SessionWord[]>(() => buildQueue(words, cardStates));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<
    { slug: string; correct: boolean; xp: number }[]
  >([]);
  const [finished, setFinished] = useState(false);
  const sessionStartRef = useRef(Date.now());

  const current = queue[currentIndex] ?? null;
  const progress = queue.length > 0 ? currentIndex / queue.length : 0;

  const submitAnswer = useCallback(
    async (params: {
      correct: boolean;
      responseTimeMs: number;
      knewIt?: boolean;
      timedOut?: boolean;
      timeRemainingPct?: number;
    }) => {
      if (!current || !user) return;

      let quality: number;
      if (mode === 'flashcard') {
        quality = flashcardQuality(params.knewIt ?? params.correct, params.responseTimeMs);
      } else {
        quality = quizQuality(
          params.correct,
          params.timedOut ?? false,
          params.timeRemainingPct ?? 50,
        );
      }

      const srsResult = sm2({
        quality,
        currentEaseFactor: current.cardState.easeFactor,
        currentInterval: current.cardState.interval,
        currentRepetitions: current.cardState.repetitions,
      });

      const streak = results.filter((r) => r.correct).length;
      const speedBonus = params.responseTimeMs < 3000 ? 5 : 0;
      const xp = calculateXp(params.correct, streak, speedBonus);

      const isNew = current.cardState.repetitions === 0 && current.cardState.interval === 0;

      const newCardState: Partial<CardState> = {
        wordSlug: current.word.slug,
        easeFactor: srsResult.easeFactor,
        interval: srsResult.interval,
        repetitions: srsResult.repetitions,
        nextReviewDate: srsResult.nextReviewDate,
        totalCorrect: (current.cardState.totalCorrect || 0) + (params.correct ? 1 : 0),
        totalWrong: (current.cardState.totalWrong || 0) + (params.correct ? 0 : 1),
        lastReviewedAt: Date.now(),
        topic: current.word.topic,
      };

      if (srsResult.repetitions >= 5 && srsResult.interval >= 21 && !current.cardState.masteredAt) {
        newCardState.masteredAt = Date.now();
      }

      const today = getTodayDateString();

      await Promise.all([
        updateCardState(user.uid, current.word.slug, newCardState),
        addReviewLog(user.uid, {
          wordSlug: current.word.slug,
          topic: current.word.topic,
          mode,
          quality,
          correct: params.correct,
          responseTimeMs: params.responseTimeMs,
          xpEarned: xp,
        }),
        updateDailyStats(user.uid, today, {
          wordsReviewed: 1,
          wordsCorrect: params.correct ? 1 : 0,
          wordsNew: isNew ? 1 : 0,
          xpEarned: xp,
        }),
        updateAggregateStats(user.uid, {
          totalXp: increment(xp),
          totalReviews: increment(1),
          lastStudyDate: today,
        }),
      ]);

      setResults((prev) => [...prev, { slug: current.word.slug, correct: params.correct, xp }]);

      if (currentIndex + 1 >= queue.length) {
        setFinished(true);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [current, currentIndex, mode, queue.length, results, user],
  );

  const totalXp = results.reduce((sum, r) => sum + r.xp, 0);
  const correctCount = results.filter((r) => r.correct).length;

  return {
    current,
    currentIndex,
    total: queue.length,
    progress,
    finished,
    submitAnswer,
    results,
    totalXp,
    correctCount,
    sessionDuration: Date.now() - sessionStartRef.current,
  };
}

function buildQueue(
  words: Word[],
  cardStates: Map<string, CardState>,
): SessionWord[] {
  const now = Date.now();
  const overdue: SessionWord[] = [];
  const due: SessionWord[] = [];
  const newWords: SessionWord[] = [];

  for (const word of words) {
    const cs = cardStates.get(word.slug) ?? {
      ...DEFAULT_CARD_STATE,
      wordSlug: word.slug,
      nextReviewDate: 0,
      lastReviewedAt: 0,
      topic: word.topic,
    };
    const sw: SessionWord = { word, cardState: cs as CardState };

    if (cs.repetitions === 0 && cs.interval === 0) {
      newWords.push(sw);
    } else if (cs.nextReviewDate <= now) {
      if (cs.nextReviewDate < now - 24 * 60 * 60 * 1000) {
        overdue.push(sw);
      } else {
        due.push(sw);
      }
    }
  }

  const sorted = [...overdue, ...due, ...shuffle(newWords)];
  return sorted.slice(0, ROUND_SIZE);
}
