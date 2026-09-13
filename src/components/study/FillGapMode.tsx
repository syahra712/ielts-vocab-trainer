'use client';

import { useState, useMemo } from 'react';
import type { Word } from '@/types/word';
import { TutorPanel } from './TutorPanel';

interface Props {
  word: Word;
  onAnswer: (params: {
    correct: boolean;
    responseTimeMs: number;
  }) => void;
}

export function FillGapMode({ word, onAnswer }: Props) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  const sentence = useMemo(() => {
    const raw = word.example.replace(/<\/?b>/g, '');
    const regex = new RegExp(`\\b${word.word}\\b`, 'i');
    return raw.replace(regex, '______');
  }, [word]);

  const isCorrect = input.trim().toLowerCase() === word.word.toLowerCase();

  function handleSubmit() {
    if (!input.trim()) return;
    setSubmitted(true);
  }

  function handleNext() {
    onAnswer({
      correct: isCorrect,
      responseTimeMs: Date.now() - startTime,
    });
    setInput('');
    setSubmitted(false);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="rounded-full bg-[#fef9f0] px-3 py-0.5 text-[11px] font-medium text-[#9a6b20]">
            Fill the gap
          </span>
          <span className="text-[11px] text-[#b0b0b8]">{word.pos}</span>
        </div>

        <p className="mt-4 text-[13px] text-[#8a8a9a]">
          {word.definition}
        </p>

        <p className="mt-6 text-center text-[16px] leading-relaxed text-[#1a1a2e]">
          {sentence}
        </p>

        <div className="mt-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
            disabled={submitted}
            placeholder="Type the missing word..."
            autoFocus
            className={`w-full rounded-xl border px-4 py-3 text-center text-[16px] font-medium outline-none transition-colors ${
              submitted
                ? isCorrect
                  ? 'border-[#2d6a4f] bg-[#f0f8f4] text-[#2d6a4f]'
                  : 'border-[#a33030] bg-[#fdf0f0] text-[#a33030]'
                : 'border-[#ededec] bg-[#f0f4f8] text-[#1a1a2e] focus:border-[#3d5a80]'
            }`}
          />
        </div>

        {submitted && !isCorrect && (
          <p className="mt-3 text-center text-[13px] text-[#8a8a9a]">
            Correct answer:{' '}
            <span className="font-medium text-[#2d6a4f]">
              {word.word}
            </span>
          </p>
        )}
      </div>

      {submitted && <TutorPanel word={word} />}

      <div className="mt-5 w-full">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="w-full rounded-xl bg-[#3d5a80] py-3.5 text-[14px] font-medium text-white transition-all hover:bg-[#34506f] active:scale-[0.98] disabled:opacity-50"
          >
            Check answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full rounded-xl bg-[#3d5a80] py-3.5 text-[14px] font-medium text-white transition-all hover:bg-[#34506f] active:scale-[0.98]"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
