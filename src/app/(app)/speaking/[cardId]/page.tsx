'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import part2Data from '@/data/speaking/part2.json';

type Phase = 'prep' | 'speaking' | 'part3' | 'done';

export default function SpeakingPracticePage() {
  const params = useParams();
  const cardId = params.cardId as string;
  const card = part2Data.find((c) => c.id === cardId);

  const [phase, setPhase] = useState<Phase>('prep');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentPart3, setCurrentPart3] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const PREP_TIME = 60;
  const SPEAKING_TIME = 120;

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsElapsed((s) => {
          const next = s + 1;
          if (phase === 'prep' && next >= PREP_TIME) {
            clearInterval(intervalRef.current);
            setTimerRunning(false);
            setPhase('speaking');
            return 0;
          }
          if (phase === 'speaking' && next >= SPEAKING_TIME) {
            clearInterval(intervalRef.current);
            setTimerRunning(false);
            setPhase('part3');
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, phase]);

  function startTimer() {
    setSecondsElapsed(0);
    setTimerRunning(true);
  }

  function skipToNext() {
    clearInterval(intervalRef.current);
    setTimerRunning(false);
    setSecondsElapsed(0);
    if (phase === 'prep') setPhase('speaking');
    else if (phase === 'speaking') setPhase('part3');
    else if (phase === 'part3') setPhase('done');
  }

  const timeLimit = phase === 'prep' ? PREP_TIME : SPEAKING_TIME;
  const timeRemaining = timeLimit - secondsElapsed;
  const progress = (secondsElapsed / timeLimit) * 100;
  const minutes = Math.floor(Math.abs(timeRemaining) / 60);
  const seconds = Math.abs(timeRemaining) % 60;

  if (!card) {
    return (
      <div className="mx-auto max-w-xl rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-8 text-center">
        <p className="text-[13px] text-[#8a8a9a]">Card not found.</p>
        <Link href="/speaking" className="mt-3 inline-block text-[13px] text-[#3d5a80] hover:underline">
          Back to Speaking
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <Link href="/speaking" className="inline-flex items-center gap-1.5 text-[13px] text-[#8a8a9a] hover:text-[#3d5a80]">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Speaking
      </Link>

      {/* Phase indicator */}
      <div className="flex gap-1">
        {(['prep', 'speaking', 'part3'] as const).map((p) => (
          <div
            key={p}
            className={`h-1 flex-1 rounded-full transition-colors ${
              p === phase ? 'bg-[#3d5a80]' :
              (['prep', 'speaking', 'part3'].indexOf(p) < ['prep', 'speaking', 'part3'].indexOf(phase)) ? 'bg-[#2d6a4f]' : 'bg-[#ededec]'
            }`}
          />
        ))}
      </div>

      {/* Prep phase */}
      {phase === 'prep' && (
        <>
          <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-[#fef9f0] px-2.5 py-0.5 text-[10px] font-medium text-[#9a6b20]">
                Part 2 — Preparation
              </span>
              <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[10px] font-medium text-[#3d5a80]">
                {card.category}
              </span>
            </div>
            <p className="mt-3 text-[16px] font-medium leading-relaxed text-[#1a1a2e]">
              {card.cueCard}
            </p>
            <div className="mt-3 space-y-1.5">
              {card.bullets.map((b, i) => (
                <p key={i} className="text-[13px] text-[#8a8a9a]">• {b}</p>
              ))}
            </div>
          </div>

          {/* Timer */}
          {!timerRunning && secondsElapsed === 0 ? (
            <button
              onClick={startTimer}
              className="w-full rounded-xl bg-[#3d5a80] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#34506f]"
            >
              Start 1-minute prep timer
            </button>
          ) : (
            <div className="space-y-3">
              <div className="h-2 w-full rounded-full bg-[#f0f0ee]">
                <div
                  className="h-full rounded-full bg-[#9a6b20] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[24px] font-medium tabular-nums text-[#9a6b20]">
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
                <button
                  onClick={skipToNext}
                  className="text-[13px] text-[#3d5a80] hover:underline"
                >
                  Ready — skip to speaking
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowTips(!showTips)}
            className="flex w-full items-center justify-between rounded-xl border border-dashed border-[#3d5a80]/30 bg-[#f0f4f8]/50 px-4 py-3 text-left"
          >
            <span className="text-[13px] font-medium text-[#3d5a80]">
              {showTips ? 'Hide tips' : 'Show tips for this card'}
            </span>
            <svg className={`h-4 w-4 text-[#3d5a80] transition-transform ${showTips ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {showTips && (
            <div className="rounded-xl bg-[#f0f4f8] p-4">
              <p className="text-[12px] text-[#3d5a80]">{card.tips}</p>
            </div>
          )}
        </>
      )}

      {/* Speaking phase */}
      {phase === 'speaking' && (
        <>
          <div className="rounded-[14px] border border-[#2d6a4f]/20 bg-[#f0f8f4] p-5 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#2d6a4f]">
              Now speaking
            </p>
            <p className="mt-1 text-[13px] text-[#8a8a9a]">
              Speak for 1-2 minutes. Cover all the bullet points.
            </p>
          </div>

          <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-4">
            <p className="text-[14px] font-medium text-[#1a1a2e]">{card.cueCard}</p>
            <div className="mt-2 space-y-1">
              {card.bullets.map((b, i) => (
                <p key={i} className="text-[12px] text-[#8a8a9a]">• {b}</p>
              ))}
            </div>
          </div>

          {!timerRunning && secondsElapsed === 0 ? (
            <button
              onClick={startTimer}
              className="w-full rounded-xl bg-[#2d6a4f] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#245a42]"
            >
              Start 2-minute speaking timer
            </button>
          ) : (
            <div className="space-y-3">
              <div className="h-2 w-full rounded-full bg-[#f0f0ee]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: timeRemaining < 30 ? '#a33030' : '#2d6a4f',
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-[24px] font-medium tabular-nums ${timeRemaining < 30 ? 'text-[#a33030]' : 'text-[#2d6a4f]'}`}>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
                <button
                  onClick={skipToNext}
                  className="text-[13px] text-[#3d5a80] hover:underline"
                >
                  Move to Part 3
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Part 3 phase */}
      {phase === 'part3' && (
        <>
          <div className="rounded-[14px] border border-[#3d5a80]/20 bg-[#f0f4f8] p-5 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#3d5a80]">
              Part 3 — Discussion
            </p>
            <p className="mt-1 text-[13px] text-[#8a8a9a]">
              The examiner asks abstract follow-up questions. Give detailed answers (3-5 sentences).
            </p>
          </div>

          <div className="space-y-3">
            {card.part3.map((q, i) => (
              <div
                key={i}
                className={`rounded-[14px] border p-4 transition-colors ${
                  i === currentPart3
                    ? 'border-[#3d5a80]/30 bg-[#f0f4f8]'
                    : i < currentPart3
                    ? 'border-[#2d6a4f]/20 bg-[#f0f8f4]'
                    : 'border-[#ededec] bg-[#fcfcfb]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-medium ${
                    i < currentPart3 ? 'bg-[#2d6a4f] text-white' : i === currentPart3 ? 'bg-[#3d5a80] text-white' : 'bg-[#f0f0ee] text-[#8a8a9a]'
                  }`}>
                    {i < currentPart3 ? '✓' : i + 1}
                  </span>
                  <p className={`text-[14px] ${i === currentPart3 ? 'font-medium text-[#1a1a2e]' : i < currentPart3 ? 'text-[#2d6a4f]' : 'text-[#8a8a9a]'}`}>
                    {q}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {currentPart3 < card.part3.length ? (
            <button
              onClick={() => setCurrentPart3((c) => c + 1)}
              className="w-full rounded-xl bg-[#3d5a80] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#34506f]"
            >
              {currentPart3 < card.part3.length - 1 ? 'Next question' : 'Finish practice'}
            </button>
          ) : (
            <div className="rounded-[14px] bg-[#f0f8f4] p-5 text-center">
              <p className="text-[16px] font-medium text-[#2d6a4f]">Practice complete</p>
              <p className="mt-1 text-[13px] text-[#8a8a9a]">
                Great work! Try another cue card to keep improving.
              </p>
              <Link
                href="/speaking"
                className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#3d5a80] hover:underline"
              >
                Back to Speaking
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
