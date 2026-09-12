'use client';

import { useState, useMemo } from 'react';
import type { Word } from '@/types/word';
import { TutorPanel } from './TutorPanel';

interface Props {
  word: Word;
  onAnswer: (params: {
    correct: boolean;
    responseTimeMs: number;
  }) => void;
}

export function FillGapMode({ word, onAnswer }: Props) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  const sentence = useMemo(() => {
    const raw = word.example.replace(/<\/?b>/g, '');
    const regex = new RegExp(`\\b${word.word}\\b`, 'i');
    return raw.replace(regex, '______');
  }, [word]);

  const isCorrect = input.trim().toLowerCase() === word.word.toLowerCase();

  function handleSubmit() {
    if (!input.trim()) return;
    setSubmitted(true);
  }

  function handleNext() {
    onAnswer({
      correct: isCorrect,
      responseTimeMs: Date.now() - startTime,
    });
    setInput('');
    setSubmitted(false);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
            Fill the Gap
          </span>
          <span className="text-xs text-gray-400">{word.pos}</span>
        </div>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {word.definition}
        </p>

        <p className="mt-6 text-center text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          {sentence}
        </p>

        <div className="mt-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
            disabled={submitted}
            placeholder="Type the missing word..."
            autoFocus
            className={`w-full rounded-xl border-2 px-4 py-3 text-center text-lg font-medium outline-none transition-colors ${
              submitted
                ? isCorrect
                  ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950/30 dark:text-green-300'
                  : 'border-red-500 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-950/30 dark:text-red-300'
                : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
          />
        </div>

        {submitted && !isCorrect && (
          <p className="mt-3 text-center text-sm text-gray-500">
            Correct answer:{' '}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {word.word}
            </span>
          </p>
        )}
      </div>

      {submitted && <TutorPanel word={word} />}

      <div className="mt-6 w-full">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-full rounded-xl bg-indigo-600 py-4 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full rounded-xl bg-indigo-600 py-4 text-sm font-semibold text-white transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
