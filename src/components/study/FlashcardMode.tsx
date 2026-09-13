'use client';

import { useState, useRef } from 'react';
import type { Word } from '@/types/word';
import { TutorPanel } from './TutorPanel';

interface Props {
  word: Word;
  onAnswer: (params: {
    correct: boolean;
    knewIt: boolean;
    responseTimeMs: number;
  }) => void;
}

export function FlashcardMode({ word, onAnswer }: Props) {
  const [revealed, setRevealed] = useState(false);
  const revealTimeRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  function handleReveal() {
    setRevealed(true);
    revealTimeRef.current = Date.now() - startTimeRef.current;
  }

  function handleAnswer(knewIt: boolean) {
    onAnswer({
      correct: knewIt,
      knewIt,
      responseTimeMs: revealTimeRef.current,
    });
    setRevealed(false);
    startTimeRef.current = Date.now();
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full cursor-pointer rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-8 transition-all"
        onClick={!revealed ? handleReveal : undefined}
        style={{ minHeight: 280 }}
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-[#f0f4f8] px-3 py-0.5 text-[11px] font-medium text-[#3d5a80]">
            {word.pos}
          </span>
          <span className="text-[11px] text-[#b0b0b8]">
            Difficulty {word.difficulty}/3
          </span>
        </div>

        <h2 className="mt-4 text-center text-[28px] font-medium text-[#1a1a2e]">
          {word.word}
        </h2>

        {!revealed ? (
          <div className="mt-8 flex flex-col items-center gap-2">
            <p className="text-[13px] text-[#b0b0b8]">
              Think of the meaning, then tap to reveal
            </p>
            <button
              onClick={handleReveal}
              className="mt-2 rounded-xl bg-[#3d5a80] px-8 py-3 text-[13px] font-medium text-white transition-colors hover:bg-[#34506f] active:scale-95"
            >
              Reveal answer
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <p className="text-center text-[16px] text-[#1a1a2e]">
              {word.definition}
            </p>
            <p
              className="text-center text-[13px] italic text-[#8a8a9a]"
              dangerouslySetInnerHTML={{ __html: word.example }}
            />
            {word.collocations.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {word.collocations.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[11px] text-[#3d5a80]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {revealed && <TutorPanel word={word} />}

      {revealed && (
        <div className="mt-5 flex w-full gap-2.5">
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 rounded-xl border border-[#a33030]/20 bg-[#fdf0f0] py-3.5 text-[13px] font-medium text-[#a33030] transition-all hover:bg-[#fce4e4] active:scale-95"
          >
            Didn&apos;t know
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 rounded-xl border border-[#2d6a4f]/20 bg-[#f0f8f4] py-3.5 text-[13px] font-medium text-[#2d6a4f] transition-all hover:bg-[#e0f0e8] active:scale-95"
          >
            Knew it
          </button>
        </div>
      )}
    </div>
  );
}
