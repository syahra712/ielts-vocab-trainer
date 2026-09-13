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
    <div className="space-y-5">
      <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-8 text-center">
        <h2 className="text-[22px] font-medium text-[#1a1a2e]">
          Round complete
        </h2>
        <p className="mt-1 text-[13px] text-[#8a8a9a]">
          {accuracy >= 80 ? 'Great job — keep the streak going' : 'Keep practicing, you\'ll get there'}
        </p>
        <div className="mt-6 flex justify-center gap-6">
          <div>
            <p className="text-[28px] font-medium tabular-nums text-[#2d6a4f]">
              {accuracy}%
            </p>
            <p className="text-[11px] uppercase tracking-wide text-[#8a8a9a]">Accuracy</p>
          </div>
          <div>
            <p className="text-[28px] font-medium tabular-nums text-[#3d5a80]">
              +{totalXp}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-[#8a8a9a]">XP earned</p>
          </div>
          <div>
            <p className="text-[28px] font-medium tabular-nums text-[#1a1a2e]">
              {correctCount}/{total}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-[#8a8a9a]">Correct</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {results.map((r) => (
          <div
            key={r.slug}
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-[13px] ${
              r.correct
                ? 'bg-[#f0f8f4] text-[#2d6a4f]'
                : 'bg-[#fdf0f0] text-[#a33030]'
            }`}
          >
            <span className="font-medium">{r.slug.replace(/-/g, ' ')}</span>
            <span>{r.correct ? 'Correct' : 'Missed'} +{r.xp} XP</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2.5">
        <Link
          href="/study"
          className="flex-1 rounded-xl border border-[#ededec] bg-[#fcfcfb] py-3 text-center text-[13px] font-medium text-[#1a1a2e] transition-colors hover:bg-[#f0f4f8]"
        >
          Back to study
        </Link>
        <Link
          href="/study/flashcard"
          className="flex-1 rounded-xl bg-[#3d5a80] py-3 text-center text-[13px] font-medium text-white transition-colors hover:bg-[#34506f]"
        >
          Another round
        </Link>
      </div>
    </div>
  );
}
