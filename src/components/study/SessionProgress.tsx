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
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-[#8a8a9a]">
          {current + 1} of {total}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[#2d6a4f]">
            {correctCount} correct
          </span>
          <span className="font-medium text-[#3d5a80]">
            +{totalXp} XP
          </span>
        </div>
      </div>
      <div className="h-1 w-full rounded-full bg-[#f0f0ee]">
        <div
          className="h-full rounded-full bg-[#3d5a80] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
