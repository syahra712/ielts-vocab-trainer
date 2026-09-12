'use client';

import Link from 'next/link';
import { TOPIC_LABELS, type Topic } from '@/types/word';

const TOPICS: { key: Topic | 'all'; color: string }[] = [
  { key: 'all' as Topic, color: 'bg-gray-600' },
  { key: 'academic', color: 'bg-blue-500' },
  { key: 'environment', color: 'bg-green-500' },
  { key: 'society', color: 'bg-purple-500' },
  { key: 'technology', color: 'bg-cyan-500' },
  { key: 'health', color: 'bg-red-500' },
  { key: 'education', color: 'bg-amber-500' },
  { key: 'economy', color: 'bg-emerald-500' },
];

const MODES = [
  {
    key: 'flashcard',
    label: 'Flashcards',
    desc: 'See the word, recall the meaning',
    icon: '🃏',
  },
  {
    key: 'fill-gap',
    label: 'Fill the Gap',
    desc: 'Complete the sentence with the right word',
    icon: '✏️',
  },
  {
    key: 'speed',
    label: 'Speed Quiz',
    desc: 'Pick the correct definition under time pressure',
    icon: '⚡',
  },
];

export default function StudyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Study
      </h1>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">
          Pick a Topic
        </h2>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t.key}
              className={`rounded-full px-4 py-1.5 text-sm font-medium text-white ${t.color} transition-opacity hover:opacity-90`}
            >
              {t.key === 'all' ? 'All Topics' : TOPIC_LABELS[t.key as Topic]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide dark:text-gray-400">
          Choose a Mode
        </h2>
        <div className="space-y-3">
          {MODES.map((mode) => (
            <Link
              key={mode.key}
              href={`/study/${mode.key}`}
              className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md active:scale-[0.98] dark:border-gray-800 dark:bg-gray-900"
            >
              <span className="text-3xl">{mode.icon}</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {mode.label}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
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
