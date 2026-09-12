'use client';

interface Props {
  current: number;
  total: number;
  correctCount: number;
  totalXp: number;
}

export function SessionProgress({ current, total, correctCount, totalXp }: Props) {
  const pct = total > 0 ? ((current) / total) * 100 : 0;

  return (
    <div className="mb-6 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-500 dark:text-gray-400">
          {current + 1} of {total}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-green-600 dark:text-green-400">
            {correctCount} correct
          </span>
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            +{totalXp} XP
          </span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
