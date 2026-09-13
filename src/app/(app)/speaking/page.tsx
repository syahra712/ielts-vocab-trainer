'use client';

import { useState } from 'react';
import Link from 'next/link';
import part1Data from '@/data/speaking/part1.json';
import part2Data from '@/data/speaking/part2.json';
import phrasesData from '@/data/speaking/phrases.json';

type Tab = 'part1' | 'part2' | 'phrases';

export default function SpeakingPage() {
  const [tab, setTab] = useState<Tab>('part1');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedPart2Category, setSelectedPart2Category] = useState<string>('all');

  const tabs: { key: Tab; label: string; desc: string }[] = [
    { key: 'part1', label: 'Part 1', desc: 'Personal questions' },
    { key: 'part2', label: 'Part 2 & 3', desc: 'Cue cards + discussion' },
    { key: 'phrases', label: 'Phrases', desc: 'Useful expressions' },
  ];

  const part2Categories = ['all', ...new Set(part2Data.map((c) => c.category))];
  const filteredPart2 = selectedPart2Category === 'all'
    ? part2Data
    : part2Data.filter((c) => c.category === selectedPart2Category);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium text-[#1a1a2e] md:text-[28px]">
          Speaking
        </h1>
        <p className="mt-1 text-[13px] text-[#8a8a9a]">
          Practice all 3 parts with real questions, cue cards, and useful phrases
        </p>
      </div>

      {/* Tab switcher */}
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

      {/* Part 1 tab */}
      {tab === 'part1' && (
        <div className="space-y-3">
          <div className="rounded-xl bg-[#f0f4f8] p-3.5">
            <p className="text-[12px] font-medium text-[#3d5a80]">Part 1 Strategy</p>
            <p className="mt-1 text-[12px] text-[#8a8a9a]">
              Answer in 2-3 sentences. Use the PEE method: Point → Explain → Example.
              Don&apos;t give one-word answers, but don&apos;t ramble either. 4-5 minutes total.
            </p>
          </div>

          {part1Data.map((topic) => {
            const isOpen = expandedTopic === topic.topic;
            return (
              <div key={topic.topic} className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] overflow-hidden">
                <button
                  onClick={() => setExpandedTopic(isOpen ? null : topic.topic)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#f0f4f8]"
                >
                  <div>
                    <p className="text-[14px] font-medium text-[#1a1a2e]">{topic.topic}</p>
                    <p className="text-[12px] text-[#8a8a9a]">{topic.questions.length} questions</p>
                  </div>
                  <svg
                    className={`h-4 w-4 text-[#b0b0b8] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-[#ededec] px-4 py-3 space-y-2">
                    {topic.questions.map((q, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-[#f0f4f8]/50 p-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#3d5a80]/10 text-[10px] font-medium text-[#3d5a80]">
                          {i + 1}
                        </span>
                        <p className="text-[13px] text-[#1a1a2e]">{q}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Part 2 & 3 tab */}
      {tab === 'part2' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#fef9f0] p-3.5">
            <p className="text-[12px] font-medium text-[#9a6b20]">Part 2 Strategy</p>
            <p className="mt-1 text-[12px] text-[#8a8a9a]">
              1 minute to prepare, 1-2 minutes to speak. Cover ALL bullet points.
              Use the cue card bullets as your structure. End naturally — don&apos;t stop mid-sentence.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {part2Categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedPart2Category(cat)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  selectedPart2Category === cat
                    ? 'bg-[#3d5a80] text-white'
                    : 'border border-[#ededec] bg-[#fcfcfb] text-[#8a8a9a] hover:bg-[#f0f4f8]'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredPart2.map((card) => (
              <Link
                key={card.id}
                href={`/speaking/${card.id}`}
                className="block rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-4 transition-colors hover:bg-[#f0f4f8]"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[10px] font-medium text-[#3d5a80]">
                    {card.category}
                  </span>
                  <span className="rounded-full bg-[#f0f8f4] px-2.5 py-0.5 text-[10px] font-medium text-[#2d6a4f]">
                    + {card.part3.length} Part 3 Qs
                  </span>
                </div>
                <p className="text-[14px] font-medium text-[#1a1a2e]">{card.cueCard}</p>
                <div className="mt-2 space-y-1">
                  {card.bullets.map((b, i) => (
                    <p key={i} className="text-[12px] text-[#8a8a9a]">• {b}</p>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Phrases tab */}
      {tab === 'phrases' && (
        <div className="space-y-3">
          <p className="text-[12px] text-[#8a8a9a]">
            {phrasesData.categories.reduce((acc, c) => acc + c.phrases.length, 0)} phrases across {phrasesData.categories.length} categories.
            Learn these to sound natural and score higher.
          </p>

          {phrasesData.categories.map((cat) => {
            const isOpen = expandedCategory === cat.id;
            return (
              <div key={cat.id} className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] overflow-hidden">
                <button
                  onClick={() => setExpandedCategory(isOpen ? null : cat.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#f0f4f8]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <p className="text-[14px] font-medium text-[#1a1a2e]">{cat.label}</p>
                      <p className="text-[12px] text-[#8a8a9a]">{cat.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[11px] font-medium text-[#3d5a80]">
                      {cat.phrases.length}
                    </span>
                    <svg
                      className={`h-4 w-4 text-[#b0b0b8] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[#ededec] px-4 py-3 space-y-2.5">
                    {cat.phrases.map((p, i) => (
                      <div key={i} className="rounded-xl bg-[#f0f4f8]/50 p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[14px] font-medium text-[#1a1a2e]">&ldquo;{p.phrase}&rdquo;</p>
                          <span
                            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor: p.band >= 8 ? '#fef9f0' : '#f0f4f8',
                              color: p.band >= 8 ? '#9a6b20' : '#3d5a80',
                            }}
                          >
                            Band {p.band}+
                          </span>
                        </div>
                        <p className="mt-1.5 text-[12px] text-[#3d5a80]">{p.when}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
