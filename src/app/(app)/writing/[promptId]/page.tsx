'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import prompts from '@/data/writing/prompts.json';
import essayTypes from '@/data/writing/essay-types.json';

export default function WritingPracticePage() {
  const params = useParams();
  const promptId = params.promptId as string;
  const prompt = prompts.find((p) => p.id === promptId);
  const essayType = prompt ? essayTypes.find((t) => t.id === prompt.type) : null;

  const [essay, setEssay] = useState('');
  const [showStructure, setShowStructure] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const isUnderMin = wordCount < 250;
  const isOverMax = wordCount > 300;
  const TIMER_LIMIT = 40 * 60;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function toggleTimer() {
    if (timerRunning) {
      clearInterval(intervalRef.current);
      setTimerRunning(false);
    } else {
      setTimerRunning(true);
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((s) => s + 1);
      }, 1000);
      textareaRef.current?.focus();
    }
  }

  function resetTimer() {
    clearInterval(intervalRef.current);
    setTimerRunning(false);
    setSecondsElapsed(0);
  }

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const timeRemaining = TIMER_LIMIT - secondsElapsed;
  const isOverTime = timeRemaining <= 0;

  if (!prompt || !essayType) {
    return (
      <div className="mx-auto max-w-xl rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-8 text-center">
        <p className="text-[13px] text-[#8a8a9a]">Prompt not found.</p>
        <Link href="/writing" className="mt-3 inline-block text-[13px] text-[#3d5a80] hover:underline">
          Back to Writing
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href="/writing" className="inline-flex items-center gap-1.5 text-[13px] text-[#8a8a9a] hover:text-[#3d5a80]">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Writing
      </Link>

      {/* Prompt card */}
      <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
        <div className="mb-3 flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: `${essayType.color}15`,
              color: essayType.color,
            }}
          >
            {essayType.label}
          </span>
          <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[10px] font-medium text-[#8a8a9a]">
            {prompt.topic}
          </span>
        </div>
        <p className="text-[14px] leading-relaxed text-[#1a1a2e]">{prompt.prompt}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {prompt.keyVocab.map((v) => (
            <span key={v} className="rounded-md bg-[#fef9f0] px-2 py-0.5 text-[10px] text-[#9a6b20]">
              Try using: {v}
            </span>
          ))}
        </div>
      </div>

      {/* Timer + word count bar */}
      <div className="flex items-center justify-between rounded-xl border border-[#ededec] bg-[#fcfcfb] px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTimer}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3d5a80] text-white transition-colors hover:bg-[#34506f]"
          >
            {timerRunning ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <div>
            <p className={`text-[18px] font-medium tabular-nums ${isOverTime ? 'text-[#a33030]' : 'text-[#1a1a2e]'}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </p>
            <p className="text-[10px] text-[#b0b0b8]">
              {isOverTime ? 'Over time!' : `${Math.floor(timeRemaining / 60)}m remaining`}
            </p>
          </div>
          {secondsElapsed > 0 && (
            <button onClick={resetTimer} className="text-[11px] text-[#8a8a9a] hover:text-[#a33030]">
              Reset
            </button>
          )}
        </div>

        <div className="text-right">
          <p className={`text-[18px] font-medium tabular-nums ${isUnderMin ? 'text-[#9a6b20]' : isOverMax ? 'text-[#a33030]' : 'text-[#2d6a4f]'}`}>
            {wordCount}
          </p>
          <p className="text-[10px] text-[#b0b0b8]">
            {isUnderMin ? `${250 - wordCount} more needed` : isOverMax ? 'Too long — trim it' : 'words (250-300 target)'}
          </p>
        </div>
      </div>

      {/* Structure guide toggle */}
      <button
        onClick={() => setShowStructure(!showStructure)}
        className="flex w-full items-center justify-between rounded-xl border border-dashed border-[#3d5a80]/30 bg-[#f0f4f8]/50 px-4 py-3 text-left transition-colors hover:bg-[#f0f4f8]"
      >
        <span className="text-[13px] font-medium text-[#3d5a80]">
          {showStructure ? 'Hide' : 'Show'} essay structure guide
        </span>
        <svg
          className={`h-4 w-4 text-[#3d5a80] transition-transform ${showStructure ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {showStructure && (
        <div className="space-y-3 rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-4">
          {essayType.structure.map((para, i) => (
            <div key={i} className="flex gap-3">
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-medium text-white"
                style={{ backgroundColor: essayType.color }}
              >
                {i + 1}
              </span>
              <div>
                <p className="text-[13px] font-medium text-[#1a1a2e]">{para.paragraph}</p>
                <p className="text-[12px] text-[#3d5a80]">{para.template}</p>
                <p className="mt-1 text-[11px] text-[#8a8a9a]">~{para.sentences} sentences</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Writing area */}
      <textarea
        ref={textareaRef}
        value={essay}
        onChange={(e) => setEssay(e.target.value)}
        placeholder="Start writing your essay here..."
        className="h-80 w-full resize-y rounded-[14px] border border-[#ededec] bg-white p-5 text-[14px] leading-relaxed text-[#1a1a2e] placeholder-[#b0b0b8] outline-none transition-colors focus:border-[#3d5a80] md:h-96"
      />

      {/* Word count progress bar */}
      <div className="h-1.5 w-full rounded-full bg-[#f0f0ee]">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min((wordCount / 300) * 100, 100)}%`,
            backgroundColor: isUnderMin ? '#9a6b20' : isOverMax ? '#a33030' : '#2d6a4f',
          }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[#b0b0b8]">
        <span>0</span>
        <span className={wordCount >= 250 ? 'font-medium text-[#2d6a4f]' : ''}>250 min</span>
        <span>300 ideal</span>
      </div>
    </div>
  );
}
