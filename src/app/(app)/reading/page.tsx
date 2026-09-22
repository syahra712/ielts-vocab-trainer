'use client';

import { useState } from 'react';
import Link from 'next/link';
import techniques from '@/data/reading/techniques.json';
import passages from '@/data/reading/passages.json';

type Tab = 'techniques' | 'practice' | 'tips';

export default function ReadingPage() {
  const [tab, setTab] = useState<Tab>('techniques');
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const tabs: { key: Tab; label: string; desc: string }[] = [
    { key: 'techniques', label: 'Question Types', desc: '8 types with strategies' },
    { key: 'practice', label: 'Practice', desc: 'Read & answer' },
    { key: 'tips', label: 'Speed Tips', desc: 'Time management' },
  ];

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];
  const filteredPassages = selectedDifficulty === 'all'
    ? passages
    : passages.filter((p) => {
        if (selectedDifficulty === 'Easy') return p.difficulty === 1;
        if (selectedDifficulty === 'Medium') return p.difficulty === 2;
        return p.difficulty === 3;
      });

  const difficultyLabel = (d: number) =>
    d === 1 ? 'Easy' : d === 2 ? 'Medium' : 'Hard';
  const difficultyColor = (d: number) =>
    d === 1 ? '#2d6a4f' : d === 2 ? '#9a6b20' : '#a33030';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium text-[#1a1a2e] md:text-[28px]">Reading</h1>
        <p className="mt-1 text-[13px] text-[#8a8a9a]">
          Master all 8 question types, practice with real passages, and manage your time
        </p>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors ${
              tab === t.key
                ? 'bg-[#3d5a80] text-white'
                : 'border border-[#ededec] bg-[#fcfcfb] text-[#8a8a9a] hover:bg-[#f0f4f8]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'techniques' && (
        <div className="space-y-3">
          <div className="rounded-xl bg-[#f0f4f8] p-3.5">
            <p className="text-[12px] font-medium text-[#3d5a80]">Reading Strategy</p>
            <p className="mt-1 text-[12px] text-[#8a8a9a]">
              60 minutes for 3 passages, 40 questions. Skim each passage in 2-3 minutes
              before answering. Statements follow passage order — use this to locate answers faster.
            </p>
          </div>

          {techniques.questionTypes.map((qt) => {
            const isOpen = expandedType === qt.id;
            return (
              <div key={qt.id} className="overflow-hidden rounded-[14px] border border-[#ededec] bg-[#fcfcfb]">
                <button
                  onClick={() => setExpandedType(isOpen ? null : qt.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#f0f4f8]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: qt.color }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-medium text-[#1a1a2e]">{qt.label}</p>
                        <span className="rounded-full bg-[#f0f4f8] px-2 py-0.5 text-[10px] font-medium text-[#3d5a80]">
                          {qt.frequency}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#8a8a9a]">{qt.description}</p>
                    </div>
                  </div>
                  <svg
                    className={`h-4 w-4 shrink-0 text-[#b0b0b8] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="space-y-4 border-t border-[#ededec] px-4 py-4">
                    <div>
                      <p className="mb-2 text-[12px] font-medium text-[#3d5a80]">Strategy</p>
                      <div className="space-y-1.5">
                        {qt.strategy.map((s, i) => (
                          <div key={i} className="flex items-start gap-2.5 rounded-lg bg-[#f0f4f8]/50 p-2.5">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#3d5a80]/10 text-[10px] font-medium text-[#3d5a80]">
                              {i + 1}
                            </span>
                            <p className="text-[12px] text-[#1a1a2e]">{s}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-[12px] font-medium text-[#a33030]">Common Traps</p>
                      <div className="space-y-1.5">
                        {qt.commonTraps.map((t, i) => (
                          <div key={i} className="flex items-start gap-2.5 rounded-lg bg-[#fef5f5]/50 p-2.5">
                            <span className="mt-0.5 text-[12px] text-[#a33030]">!</span>
                            <p className="text-[12px] text-[#1a1a2e]">{t}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {qt.example && (
                      <div className="rounded-xl border border-dashed border-[#3d5a80]/20 bg-[#f0f4f8]/30 p-3.5">
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#3d5a80]">Example</p>
                        <p className="text-[12px] italic text-[#8a8a9a]">&ldquo;{qt.example.passage}&rdquo;</p>
                        <p className="mt-2 text-[12px] text-[#1a1a2e]">
                          <span className="font-medium">Statement:</span> {qt.example.statement}
                        </p>
                        <p className="mt-1 text-[12px] text-[#2d6a4f]">
                          <span className="font-medium">Answer:</span> {qt.example.answer} — {qt.example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'practice' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#fef9f0] p-3.5">
            <p className="text-[12px] font-medium text-[#9a6b20]">Practice Mode</p>
            <p className="mt-1 text-[12px] text-[#8a8a9a]">
              Read passages and answer questions. Check your answers with explanations.
              Start with Easy passages and work your way up.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  selectedDifficulty === d
                    ? 'bg-[#3d5a80] text-white'
                    : 'border border-[#ededec] bg-[#fcfcfb] text-[#8a8a9a] hover:bg-[#f0f4f8]'
                }`}
              >
                {d === 'all' ? 'All' : d}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredPassages.map((passage) => (
              <Link
                key={passage.id}
                href={`/reading/${passage.id}`}
                className="block rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-4 transition-colors hover:bg-[#f0f4f8]"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: difficultyColor(passage.difficulty) + '15',
                      color: difficultyColor(passage.difficulty),
                    }}
                  >
                    {difficultyLabel(passage.difficulty)}
                  </span>
                  <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[10px] font-medium text-[#3d5a80]">
                    {passage.topic}
                  </span>
                  <span className="rounded-full bg-[#f0f0ee] px-2.5 py-0.5 text-[10px] font-medium text-[#8a8a9a]">
                    {passage.wordCount} words
                  </span>
                </div>
                <p className="text-[14px] font-medium text-[#1a1a2e]">{passage.title}</p>
                <p className="mt-1 text-[12px] text-[#8a8a9a]">
                  {passage.questions.reduce((acc, q) => acc + q.items.length, 0)} questions
                  ({passage.questions.map((q) => q.type.toUpperCase().replace('-', '/')).join(', ')})
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {tab === 'tips' && (
        <div className="space-y-5">
          <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
            <p className="text-[14px] font-medium text-[#1a1a2e]">Time Management</p>
            <p className="mt-1 text-[13px] text-[#8a8a9a]">{techniques.timeManagement.total}</p>
            <div className="mt-4 space-y-2">
              {techniques.timeManagement.recommended.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-[#f0f4f8] p-3.5">
                  <div>
                    <p className="text-[13px] font-medium text-[#1a1a2e]">{r.passage}</p>
                    <p className="text-[12px] text-[#8a8a9a]">{r.tip}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#3d5a80] px-3 py-1 text-[12px] font-medium text-white">
                    {r.time}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5">
              {techniques.timeManagement.tips.map((t, i) => (
                <p key={i} className="text-[12px] text-[#8a8a9a]">• {t}</p>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
            <p className="text-[14px] font-medium text-[#1a1a2e]">Skimming Technique</p>
            <p className="mt-1 text-[12px] text-[#8a8a9a]">Read faster without losing comprehension</p>
            <div className="mt-3 space-y-1.5">
              {techniques.skimmingTips.map((t, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg bg-[#f0f8f4]/50 p-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#2d6a4f]/10 text-[10px] font-medium text-[#2d6a4f]">
                    {i + 1}
                  </span>
                  <p className="text-[12px] text-[#1a1a2e]">{t}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
            <p className="text-[14px] font-medium text-[#1a1a2e]">Scanning Technique</p>
            <p className="mt-1 text-[12px] text-[#8a8a9a]">Find specific information quickly</p>
            <div className="mt-3 space-y-1.5">
              {techniques.scanningTips.map((t, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg bg-[#f0f4f8]/50 p-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#3d5a80]/10 text-[10px] font-medium text-[#3d5a80]">
                    {i + 1}
                  </span>
                  <p className="text-[12px] text-[#1a1a2e]">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
