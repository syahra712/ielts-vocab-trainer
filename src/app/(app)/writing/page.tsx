'use client';

import { useState } from 'react';
import Link from 'next/link';
import connectorData from '@/data/writing/connectors.json';
import essayTypes from '@/data/writing/essay-types.json';
import prompts from '@/data/writing/prompts.json';

type Tab = 'connectors' | 'structures' | 'practice';

export default function WritingPage() {
  const [tab, setTab] = useState<Tab>('connectors');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('all');

  const tabs: { key: Tab; label: string; desc: string }[] = [
    { key: 'connectors', label: 'Connectors', desc: 'Linking words & phrases' },
    { key: 'structures', label: 'Essay Templates', desc: 'Paragraph-by-paragraph guides' },
    { key: 'practice', label: 'Practice', desc: 'Timed essay prompts' },
  ];

  const topics = ['all', ...new Set(prompts.map((p) => p.topic))];
  const filteredPrompts = selectedTopic === 'all' ? prompts : prompts.filter((p) => p.topic === selectedTopic);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium text-[#1a1a2e] md:text-[28px]">
          Writing
        </h1>
        <p className="mt-1 text-[13px] text-[#8a8a9a]">
          Master Task 2 essays with connectors, templates, and timed practice
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

      {/* Connectors tab */}
      {tab === 'connectors' && (
        <div className="space-y-3">
          <p className="text-[12px] text-[#8a8a9a]">
            {connectorData.categories.reduce((acc, c) => acc + c.connectors.length, 0)} connectors across {connectorData.categories.length} categories. Tap to expand.
          </p>
          {connectorData.categories.map((cat) => {
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
                      {cat.connectors.length}
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
                  <div className="border-t border-[#ededec] px-4 py-3">
                    <div className="space-y-3">
                      {cat.connectors.map((conn, i) => (
                        <div key={i} className="rounded-xl bg-[#f0f4f8]/50 p-3.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-[14px] font-medium text-[#1a1a2e]">{conn.word}</p>
                            <span
                              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                backgroundColor: conn.band >= 8 ? '#fef9f0' : conn.band >= 7 ? '#f0f4f8' : '#f0f8f4',
                                color: conn.band >= 8 ? '#9a6b20' : conn.band >= 7 ? '#3d5a80' : '#2d6a4f',
                              }}
                            >
                              Band {conn.band}+
                            </span>
                          </div>
                          <p className="mt-1.5 text-[12px] italic text-[#8a8a9a]">{conn.usage}</p>
                          <p className="mt-1.5 text-[12px] text-[#3d5a80]">{conn.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Essay structures tab */}
      {tab === 'structures' && (
        <div className="space-y-3">
          <p className="text-[12px] text-[#8a8a9a]">
            5 essay types with paragraph-by-paragraph templates. Learn the structure, nail the score.
          </p>
          {essayTypes.map((type) => {
            const isOpen = expandedType === type.id;
            return (
              <div key={type.id} className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] overflow-hidden">
                <button
                  onClick={() => setExpandedType(isOpen ? null : type.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#f0f4f8]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <div>
                      <p className="text-[14px] font-medium text-[#1a1a2e]">{type.label}</p>
                      <p className="text-[12px] text-[#8a8a9a]">&quot;{type.question_pattern}&quot;</p>
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
                  <div className="border-t border-[#ededec] px-4 py-4 space-y-4">
                    {type.structure.map((para, i) => (
                      <div key={i} className="rounded-xl border border-[#ededec] bg-white p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className="flex h-6 w-6 items-center justify-center rounded-lg text-[11px] font-medium text-white"
                            style={{ backgroundColor: type.color }}
                          >
                            {i + 1}
                          </span>
                          <p className="text-[13px] font-medium text-[#1a1a2e]">
                            {para.paragraph}
                          </p>
                          <span className="ml-auto text-[11px] text-[#b0b0b8]">
                            ~{para.sentences} sentences
                          </span>
                        </div>

                        <p className="mb-2 text-[12px] font-medium text-[#3d5a80]">
                          {para.template}
                        </p>

                        <div className="mb-3 rounded-lg bg-[#f0f4f8] p-3">
                          <p className="text-[12px] italic text-[#1a1a2e]/70">
                            {para.example}
                          </p>
                        </div>

                        <div className="space-y-1">
                          {para.tips.map((tip, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2d6a4f]" />
                              <p className="text-[11px] text-[#8a8a9a]">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Practice tab */}
      {tab === 'practice' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
                  selectedTopic === t
                    ? 'bg-[#3d5a80] text-white'
                    : 'border border-[#ededec] bg-[#fcfcfb] text-[#8a8a9a] hover:bg-[#f0f4f8]'
                }`}
              >
                {t === 'all' ? 'All topics' : t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredPrompts.map((prompt) => {
              const type = essayTypes.find((t) => t.id === prompt.type);
              return (
                <Link
                  key={prompt.id}
                  href={`/writing/${prompt.id}`}
                  className="block rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-4 transition-colors hover:bg-[#f0f4f8]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                      style={{
                        backgroundColor: type?.color ? `${type.color}15` : '#f0f4f8',
                        color: type?.color ?? '#3d5a80',
                      }}
                    >
                      {type?.label ?? prompt.type}
                    </span>
                    <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[10px] font-medium text-[#8a8a9a]">
                      {prompt.topic}
                    </span>
                    <div className="ml-auto flex gap-0.5">
                      {[1, 2, 3].map((d) => (
                        <div
                          key={d}
                          className={`h-1.5 w-1.5 rounded-full ${
                            d <= prompt.difficulty ? 'bg-[#3d5a80]' : 'bg-[#ededec]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[#1a1a2e]">
                    {prompt.prompt}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {prompt.keyVocab.map((v) => (
                      <span key={v} className="rounded-md bg-[#fef9f0] px-2 py-0.5 text-[10px] text-[#9a6b20]">
                        {v}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
