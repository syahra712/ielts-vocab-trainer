'use client';

import { useState } from 'react';
import type { Word } from '@/types/word';

interface Props {
  word: Word;
}

export function TutorPanel({ word }: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full rounded-xl border border-dashed border-[#3d5a80]/30 py-3 text-[13px] font-medium text-[#3d5a80] transition-colors hover:bg-[#f0f4f8]"
      >
        Show tutor tips
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-3 rounded-[14px] border border-[#ededec] bg-[#f0f4f8] p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-medium text-[#3d5a80]">
          Tutor tips
        </h3>
        <button
          onClick={() => setOpen(false)}
          className="text-[11px] text-[#b0b0b8] hover:text-[#8a8a9a]"
        >
          Hide
        </button>
      </div>

      <div className="space-y-3 text-[13px]">
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[#8a8a9a]">
            Explanation
          </p>
          <p className="text-[#1a1a2e]">
            {word.tutorExplanation}
          </p>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[#8a8a9a]">
            Writing tip
          </p>
          <p className="italic text-[#8a8a9a]">
            {word.writingTip}
          </p>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[#8a8a9a]">
            Speaking tip
          </p>
          <p className="text-[#8a8a9a]">
            {word.speakingTip}
          </p>
        </div>

        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[#8a8a9a]">
            Common mistake
          </p>
          <p className="text-[#a33030]">
            {word.commonMistake}
          </p>
        </div>

        {word.synonyms.length > 0 && (
          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[#8a8a9a]">
              Synonyms
            </p>
            <div className="flex flex-wrap gap-1.5">
              {word.synonyms.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-[#fcfcfb] border border-[#ededec] px-2.5 py-0.5 text-[11px] text-[#3d5a80]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-[11px] text-[#b0b0b8]">
          {word.ieltsRelevance}
        </p>
      </div>
    </div>
  );
}
