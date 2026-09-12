'use client';

import Link from 'next/link';

interface Props {
  correctCount: number;
  total: number;
  totalXp: number;
  results: { slug: string; correct: boolean; xp: number }[];
}

export function SessionComplete({ correctCount, total, totalXp, results }: Props) {
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-2 text-5xl">
          {accuracy >= 80 ? '🔥' : accuracy >= 50 ? '👍' : '💪'}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Round Complete!
        </h2>
        <div className="mt-4 flex justify-center gap-6">
          <div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {accuracy}%
            </p>
            <p className="text-xs text-gray-500">Accuracy</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              +{totalXp}
            </p>
            <p className="text-xs text-gray-500">XP Earned</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {correctCount}/{total}
            </p>
            <p className="text-xs text-gray-500">Correct</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {results.map((r) => (
          <div
            key={r.slug}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
              r.correct
                ? 'bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300'
                : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300'
            }`}
          >
            <span className="font-medium">{r.slug.replace(/-/g, ' ')}</span>
            <span>{r.correct ? '✓' : '✗'} +{r.xp} XP</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Link
          href="/study"
          className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
        >
          Back to Study
        </Link>
        <Link
          href="/study/flashcard"
          className="flex-1 rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Another Round
        </Link>
      </div>
    </div>
  );
}
