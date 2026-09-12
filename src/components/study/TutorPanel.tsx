'use client';

import { useState } from 'react';
import type { Word } from '@/types/word';

interface Props {
  word: Word;
}

export function TutorPanel({ word }: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-xl border border-dashed border-indigo-300 py-3 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-indigo-950/30"
      >
        💡 Show Tutor Tips
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900 dark:bg-indigo-950/20">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">
          Tutor Tips
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Hide
        </button>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Explanation
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            {word.tutorExplanation}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Writing Tip
          </p>
          <p className="italic text-gray-600 dark:text-gray-400">
            {word.writingTip}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Speaking Tip
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {word.speakingTip}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
            Common Mistake
          </p>
          <p className="text-red-600 dark:text-red-400">
            {word.commonMistake}
          </p>
        </div>

        {word.synonyms.length > 0 && (
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">
              Synonyms
            </p>
            <div className="flex flex-wrap gap-1.5">
              {word.synonyms.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400">
          📌 {word.ieltsRelevance}
        </p>
      </div>
    </div>
  );
}
