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
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

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
      <div className="w-full rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-[#f0f8f4] px-3 py-0.5 text-[11px] font-medium text-[#2d6a4f]">
            Speed quiz
          </span>
          <span
            className={`text-[14px] font-medium tabular-nums ${
              timeLeft < 3
                ? 'text-[#a33030]'
                : 'text-[#8a8a9a]'
            }`}
          >
            {timeLeft.toFixed(1)}s
          </span>
        </div>

        <div className="mb-4 h-1 w-full rounded-full bg-[#f0f0ee]">
          <div
            className={`h-full rounded-full transition-all duration-100 ${
              timeLeft < 3 ? 'bg-[#a33030]' : 'bg-[#3d5a80]'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <h2 className="mb-6 text-center text-[24px] font-medium text-[#1a1a2e]">
          {word.word}
        </h2>

        <div className="space-y-2.5">
          {options.map((opt, i) => {
            let classes =
              'border-[#ededec] bg-[#fcfcfb] text-[#1a1a2e] hover:border-[#3d5a80]/30 hover:bg-[#f0f4f8]';

            if (answered) {
              if (i === correctIndex) {
                classes = 'border-[#2d6a4f] bg-[#f0f8f4] text-[#2d6a4f]';
              } else if (i === selected && i !== correctIndex) {
                classes = 'border-[#a33030] bg-[#fdf0f0] text-[#a33030]';
              } else {
                classes = 'border-[#ededec] bg-[#fcfcfb] text-[#b0b0b8]';
              }
            }

            return (
              <button
                key={opt.slug}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full rounded-xl border px-4 py-3 text-left text-[13px] font-medium transition-all active:scale-[0.98] ${classes}`}
              >
                {opt.definition}
              </button>
            );
          })}
        </div>

        {timedOut && selected === null && (
          <p className="mt-3 text-center text-[13px] font-medium text-[#a33030]">
            Time&apos;s up!
          </p>
        )}
      </div>

      {answered && <TutorPanel word={word} />}

      {answered && (
        <button
          onClick={handleNext}
          className="mt-5 w-full rounded-xl bg-[#3d5a80] py-3.5 text-[14px] font-medium text-white transition-all hover:bg-[#34506f] active:scale-[0.98]"
        >
          Continue
        </button>
      )}
    </div>
  );
}
