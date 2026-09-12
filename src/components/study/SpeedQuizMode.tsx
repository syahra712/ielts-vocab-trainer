'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import type { Word } from '@/types/word';
import { shuffle } from '@/lib/utils/shuffle';
import { TutorPanel } from './TutorPanel';

interface Props {
  word: Word;
  allWords: Word[];
  onAnswer: (params: {
    correct: boolean;
    responseTimeMs: number;
    timedOut: boolean;
    timeRemainingPct: number;
  }) => void;
}

const TIMER_SECONDS = 10;

export function SpeedQuizMode({ word, allWords, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [timedOut, setTimedOut] = useState(false);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const options = useMemo(() => {
    const distractors = shuffle(
      allWords.filter((w) => w.slug !== word.slug),
    ).slice(0, 3);
    return shuffle([word, ...distractors]);
  }, [word, allWords]);

  const correctIndex = options.findIndex((o) => o.slug === word.slug);

  useEffect(() => {
    startTimeRef.current = Date.now();
    setTimeLeft(TIMER_SECONDS);
    setSelected(null);
    setTimedOut(false);

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          return 0;
        }
        return t - 0.1;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [word.slug]);

  function handleSelect(index: number) {
    if (selected !== null || timedOut) return;
    clearInterval(timerRef.current);
    setSelected(index);
  }

  function handleNext() {
    const isCorrect = selected === correctIndex;
    onAnswer({
      correct: isCorrect,
      responseTimeMs: Date.now() - startTimeRef.current,
      timedOut,
      timeRemainingPct: (timeLeft / TIMER_SECONDS) * 100,
    });
  }

  const answered = selected !== null || timedOut;
  const pct = (timeLeft / TIMER_SECONDS) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-yellow-100 px-3 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">
            Speed Quiz
          </span>
          <span
            className={`text-sm font-bold tabular-nums ${
              timeLeft < 3
                ? 'text-red-500'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {timeLeft.toFixed(1)}s
          </span>
        </div>

        <div className="mb-4 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              timeLeft < 3 ? 'bg-red-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
          {word.word}
        </h2>

        <div className="space-y-2.5">
          {options.map((opt, i) => {
            let style =
              'border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-indigo-600';

            if (answered) {
              if (i === correctIndex) {
                style =
                  'border-green-500 bg-green-50 text-green-800 dark:border-green-600 dark:bg-green-950/30 dark:text-green-300';
              } else if (i === selected && i !== correctIndex) {
                style =
                  'border-red-500 bg-red-50 text-red-800 dark:border-red-600 dark:bg-red-950/30 dark:text-red-300';
              } else {
                style =
                  'border-gray-200 bg-gray-50 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-500';
              }
            }

            return (
              <button
                key={opt.slug}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all active:scale-[0.98] ${style}`}
              >
                {opt.definition}
              </button>
            );
          })}
        </div>

        {timedOut && selected === null && (
          <p className="mt-3 text-center text-sm font-medium text-red-500">
            Time&apos;s up!
          </p>
        )}
      </div>

      {answered && <TutorPanel word={word} />}

      {answered && (
        <button
          onClick={handleNext}
          className="mt-6 w-full rounded-xl bg-indigo-600 py-4 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          Continue
        </button>
      )}
    </div>
  );
}
