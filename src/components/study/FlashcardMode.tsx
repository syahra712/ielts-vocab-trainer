'use client';

import { useState, useRef } from 'react';
import type { Word } from '@/types/word';
import { TutorPanel } from './TutorPanel';

interface Props {
  word: Word;
  onAnswer: (params: {
    correct: boolean;
    knewIt: boolean;
    responseTimeMs: number;
  }) => void;
}

export function FlashcardMode({ word, onAnswer }: Props) {
  const [revealed, setRevealed] = useState(false);
  const revealTimeRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  function handleReveal() {
    setRevealed(true);
    revealTimeRef.current = Date.now() - startTimeRef.current;
  }

  function handleAnswer(knewIt: boolean) {
    onAnswer({
      correct: knewIt,
      knewIt,
      responseTimeMs: revealTimeRef.current,
    });
    setRevealed(false);
    startTimeRef.current = Date.now();
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full cursor-pointer rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all dark:border-gray-800 dark:bg-gray-900"
        onClick={!revealed ? handleReveal : undefined}
        style={{ minHeight: 280 }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
            {word.pos}
          </span>
          <span className="text-xs text-gray-400">
            Difficulty {word.difficulty}/3
          </span>
        </div>

        <h2 className="mt-4 text-center text-3xl font-bold text-gray-900 dark:text-white">
          {word.word}
        </h2>

        {!revealed ? (
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-sm text-gray-400">
              Think of the meaning, then tap to reveal
            </p>
            <button
              onClick={handleReveal}
              className="mt-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-95"
            >
              Reveal Answer
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-center text-lg text-gray-700 dark:text-gray-300">
              {word.definition}
            </p>
            <p
              className="text-center text-sm italic text-gray-500 dark:text-gray-400"
              dangerouslySetInnerHTML={{ __html: word.example }}
            />
            {word.collocations.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {word.collocations.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {revealed && <TutorPanel word={word} />}

      {revealed && (
        <div className="mt-6 flex w-full gap-3">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 rounded-xl border-2 border-red-200 bg-red-50 py-4 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 active:scale-95 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
          >
            Didn&apos;t Know
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 rounded-xl border-2 border-green-200 bg-green-50 py-4 text-sm font-semibold text-green-700 transition-all hover:bg-green-100 active:scale-95 dark:border-green-900 dark:bg-green-950/50 dark:text-green-400"
          >
            Knew It!
          </button>
        </div>
      )}
    </div>
  );
}
