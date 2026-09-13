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
    <div className="space-y-5">
      <h1 className="text-[22px] font-medium text-[#1a1a2e]">
        Seed database
      </h1>
      <p className="text-[13px] text-[#8a8a9a]">
        This will write {ALL_WORDS.length} words to Firestore. Only needed once.
      </p>

      {status === 'idle' && (
        <button
          onClick={handleSeed}
          className="w-full rounded-xl bg-[#3d5a80] py-3.5 text-[14px] font-medium text-white hover:bg-[#34506f]"
        >
          Seed {ALL_WORDS.length} words
        </button>
      )}

      {status === 'seeding' && (
        <div className="space-y-2">
          <div className="h-1.5 w-full rounded-full bg-[#f0f0ee]">
            <div
              className="h-full rounded-full bg-[#3d5a80] transition-all"
              style={{ width: `${(progress / ALL_WORDS.length) * 100}%` }}
            />
          </div>
          <p className="text-[13px] text-[#8a8a9a]">
            {progress} / {ALL_WORDS.length} words...
          </p>
        </div>
      )}

      {status === 'done' && (
        <div className="rounded-[14px] bg-[#f0f8f4] p-4 text-center text-[13px] text-[#2d6a4f]">
          Done! {ALL_WORDS.length} words seeded. You can start studying now.
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-[14px] bg-[#fdf0f0] p-4 text-center text-[13px] text-[#a33030]">
          Seed failed. Check console for details.
        </div>
      )}
    </div>
  );
}
