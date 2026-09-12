'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

import academicWords from '@/data/words/academic.json';
import environmentWords from '@/data/words/environment.json';
import societyWords from '@/data/words/society.json';
import technologyWords from '@/data/words/technology.json';
import healthWords from '@/data/words/health.json';
import educationWords from '@/data/words/education.json';
import economyWords from '@/data/words/economy.json';

const ALL_WORDS = [
  ...academicWords,
  ...environmentWords,
  ...societyWords,
  ...technologyWords,
  ...healthWords,
  ...educationWords,
  ...economyWords,
];

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'seeding' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);

  async function handleSeed() {
    setStatus('seeding');
    try {
      for (let i = 0; i < ALL_WORDS.length; i++) {
        const word = ALL_WORDS[i];
        await setDoc(doc(db, 'words', word.slug), {
          ...word,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setProgress(i + 1);
      }
      setStatus('done');
    } catch (err) {
      console.error('Seed error:', err);
      setStatus('error');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Seed Database
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        This will write {ALL_WORDS.length} words to Firestore. Only needed once.
      </p>

      {status === 'idle' && (
        <button
          onClick={handleSeed}
          className="w-full rounded-xl bg-indigo-600 py-4 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Seed {ALL_WORDS.length} Words
        </button>
      )}

      {status === 'seeding' && (
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-gray-800">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${(progress / ALL_WORDS.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">
            {progress} / {ALL_WORDS.length} words...
          </p>
        </div>
      )}

      {status === 'done' && (
        <div className="rounded-xl bg-green-50 p-4 text-center text-green-700 dark:bg-green-950/30 dark:text-green-300">
          Done! {ALL_WORDS.length} words seeded. You can start studying now.
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-xl bg-red-50 p-4 text-center text-red-700 dark:bg-red-950/30 dark:text-red-300">
          Seed failed. Check console for details.
        </div>
      )}
    </div>
  );
}
