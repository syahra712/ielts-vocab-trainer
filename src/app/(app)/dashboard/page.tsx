'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hey {firstName}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ready to learn some words?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Due Today</p>
          <p className="mt-1 text-3xl font-bold text-indigo-600 dark:text-indigo-400">0</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Streak</p>
          <p className="mt-1 text-3xl font-bold text-orange-500">0 days</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">XP</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600 dark:text-emerald-400">0</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Mastered</p>
          <p className="mt-1 text-3xl font-bold text-purple-600 dark:text-purple-400">0</p>
        </div>
      </div>

      <Link
        href="/study"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-[0.98]"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
        </svg>
        Start Studying
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
          Topic Progress
        </h2>
        <div className="space-y-2">
          {[
            { name: 'Academic Core', color: 'bg-blue-500' },
            { name: 'Environment', color: 'bg-green-500' },
            { name: 'Society', color: 'bg-purple-500' },
            { name: 'Technology', color: 'bg-cyan-500' },
            { name: 'Health', color: 'bg-red-500' },
            { name: 'Education', color: 'bg-amber-500' },
            { name: 'Economy', color: 'bg-emerald-500' },
          ].map((topic) => (
            <div key={topic.name} className="flex items-center gap-3">
              <span className="w-28 text-xs text-gray-600 dark:text-gray-400">
                {topic.name}
              </span>
              <div className="h-2 flex-1 rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full rounded-full ${topic.color}`}
                  style={{ width: '0%' }}
                />
              </div>
              <span className="w-8 text-right text-xs text-gray-400">0%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
