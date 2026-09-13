'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';
import { TOPIC_COUNTS } from '@/data/words';

const TOPIC_COLORS: Record<string, string> = {
  academic: '#3d5a80',
  environment: '#9a6b20',
  society: '#2d6a4f',
  technology: '#8b5e83',
  health: '#a33030',
  education: '#3d5a80',
  economy: '#9a6b20',
};

const TOPICS = Object.entries(TOPIC_COUNTS).map(([key, total]) => ({
  name: key.charAt(0).toUpperCase() + key.slice(1),
  color: TOPIC_COLORS[key] ?? '#8a8a9a',
  total,
  done: 0,
}));

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-medium text-[#1a1a2e] md:text-[28px]">
            Welcome back, {firstName}
          </h1>
          <p className="text-[13px] text-[#8a8a9a]">
            You have 0 words due today
          </p>
        </div>
        <Link
          href="/study"
          className="inline-flex items-center justify-center rounded-xl bg-[#3d5a80] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#34506f] active:scale-[0.98] sm:px-8"
        >
          Start studying
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <div className="rounded-[14px] bg-[#f0f4f8] p-4 md:p-5">
          <p className="text-[28px] font-medium tabular-nums text-[#3d5a80] md:text-[32px]">0</p>
          <p className="text-[11px] uppercase tracking-wide text-[#8a8a9a]">Words due</p>
        </div>
        <div className="rounded-[14px] bg-[#fef9f0] p-4 md:p-5">
          <p className="text-[28px] font-medium tabular-nums text-[#9a6b20] md:text-[32px]">0</p>
          <p className="text-[11px] uppercase tracking-wide text-[#8a8a9a]">Day streak</p>
        </div>
        <div className="rounded-[14px] bg-[#f0f8f4] p-4 md:p-5">
          <p className="text-[28px] font-medium tabular-nums text-[#2d6a4f] md:text-[32px]">0</p>
          <p className="text-[11px] uppercase tracking-wide text-[#8a8a9a]">Mastered</p>
        </div>
        <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-4 md:p-5">
          <p className="text-[28px] font-medium tabular-nums text-[#1a1a2e] md:text-[32px]">0</p>
          <p className="text-[11px] uppercase tracking-wide text-[#8a8a9a]">Total XP</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-[#8a8a9a]">
            Your topics
          </h2>
          <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-4">
            <div className="divide-y divide-[#f0f0ee]">
              {TOPICS.map((topic) => (
                <div key={topic.name} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: topic.color }}
                  />
                  <span className="flex-1 text-[13px] font-medium text-[#1a1a2e]">
                    {topic.name}
                  </span>
                  <div className="h-1 w-16 rounded-full bg-[#f0f0ee]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${topic.total > 0 ? (topic.done / topic.total) * 100 : 0}%`,
                        backgroundColor: topic.color,
                      }}
                    />
                  </div>
                  <span className="min-w-[36px] text-right text-[12px] tabular-nums text-[#8a8a9a]">
                    {topic.done}/{topic.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-[#8a8a9a]">
            Streak
          </h2>
          <div className="flex items-center gap-3 rounded-[14px] border border-[#f5edd8] bg-[#fef9f0] p-4">
            <div className="rounded-[10px] bg-[#fef3e2] px-3.5 py-1.5 text-[20px] font-medium tabular-nums text-[#9a6b20]">
              0
            </div>
            <div>
              <p className="text-[11px] text-[#8a8a9a]">Current streak</p>
              <p className="text-[13px] font-medium text-[#1a1a2e]">Study today to start one</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
