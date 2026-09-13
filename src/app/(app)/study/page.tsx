'use client';

import Link from 'next/link';
import { TOPIC_LABELS, type Topic } from '@/types/word';

const TOPICS: { key: Topic | 'all'; color: string }[] = [
  { key: 'all' as Topic, color: '#8a8a9a' },
  { key: 'academic', color: '#3d5a80' },
  { key: 'environment', color: '#9a6b20' },
  { key: 'society', color: '#2d6a4f' },
  { key: 'technology', color: '#8b5e83' },
  { key: 'health', color: '#a33030' },
  { key: 'education', color: '#3d5a80' },
  { key: 'economy', color: '#9a6b20' },
];

const MODES = [
  {
    key: 'flashcard',
    label: 'Flashcards',
    desc: 'See the word, recall the meaning',
    iconBg: '#f0f4f8',
    iconColor: '#3d5a80',
    iconPath: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  },
  {
    key: 'fill-gap',
    label: 'Fill the gap',
    desc: 'Complete the sentence with the right word',
    iconBg: '#fef9f0',
    iconColor: '#9a6b20',
    iconPath: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
  },
  {
    key: 'speed',
    label: 'Speed quiz',
    desc: 'Pick the correct definition under time pressure',
    iconBg: '#f0f8f4',
    iconColor: '#2d6a4f',
    iconPath: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

export default function StudyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-[22px] font-medium text-[#1a1a2e] md:text-[28px]">
        Study
      </h1>

      <div>
        <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-[#8a8a9a]">
          Pick a topic
        </h2>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t.key}
              className="rounded-full border border-[#ededec] bg-[#fcfcfb] px-3.5 py-1.5 text-[12px] font-medium transition-colors hover:bg-[#f0f4f8]"
              style={{ color: t.color }}
            >
              {t.key === 'all' ? 'All topics' : TOPIC_LABELS[t.key as Topic]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-[#8a8a9a]">
          Choose a mode
        </h2>
        <div className="grid gap-2.5 md:grid-cols-3">
          {MODES.map((mode) => (
            <Link
              key={mode.key}
              href={`/study/${mode.key}`}
              className="flex items-center gap-3.5 rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-4 transition-colors hover:bg-[#f0f4f8] active:scale-[0.98] md:flex-col md:items-start md:gap-3 md:p-5"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
                style={{ backgroundColor: mode.iconBg }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={mode.iconColor}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={mode.iconPath} />
                </svg>
              </div>
              <div>
                <p className="text-[14px] font-medium text-[#1a1a2e]">
                  {mode.label}
                </p>
                <p className="text-[12px] text-[#8a8a9a]">
                  {mode.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
