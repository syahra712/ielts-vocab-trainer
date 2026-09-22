'use client';

import { useState } from 'react';
import techniques from '@/data/listening/techniques.json';

type Tab = 'sections' | 'strategies' | 'practice';

export default function ListeningPage() {
  const [tab, setTab] = useState<Tab>('sections');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);

  // Spelling drill state
  const [spellingIndex, setSpellingIndex] = useState(0);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingRevealed, setSpellingRevealed] = useState(false);
  const [spellingScore, setSpellingScore] = useState({ correct: 0, total: 0 });

  // Number drill state
  const [numberIndex, setNumberIndex] = useState(0);
  const [numberRevealed, setNumberRevealed] = useState(false);

  const tabs: { key: Tab; label: string; desc: string }[] = [
    { key: 'sections', label: 'Sections', desc: '4 test sections' },
    { key: 'strategies', label: 'Strategies', desc: 'Core techniques' },
    { key: 'practice', label: 'Drills', desc: 'Spelling & numbers' },
  ];

  const spellingWords = techniques.practiceExercises.find((e) => e.type === 'spelling')!;
  const numberPairs = techniques.practiceExercises.find((e) => e.type === 'numbers')!;

  function checkSpelling() {
    const correct = spellingInput.trim().toLowerCase() === spellingWords.words![spellingIndex].word.toLowerCase();
    setSpellingScore({
      correct: spellingScore.correct + (correct ? 1 : 0),
      total: spellingScore.total + 1,
    });
    setSpellingRevealed(true);
  }

  function nextSpellingWord() {
    setSpellingIndex((i) => (i + 1) % spellingWords.words!.length);
    setSpellingInput('');
    setSpellingRevealed(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium text-[#1a1a2e] md:text-[28px]">Listening</h1>
        <p className="mt-1 text-[13px] text-[#8a8a9a]">
          Understand all 4 sections, learn key strategies, and practice spelling & numbers
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

      {tab === 'sections' && (
        <div className="space-y-3">
          <div className="rounded-xl bg-[#f0f4f8] p-3.5">
            <p className="text-[12px] font-medium text-[#3d5a80]">Listening Overview</p>
            <p className="mt-1 text-[12px] text-[#8a8a9a]">
              30 minutes of audio + 10 minutes to transfer answers. 40 questions across 4 sections.
              Difficulty increases from Section 1 (easiest) to Section 4 (hardest). You hear the audio ONCE.
            </p>
          </div>

          {techniques.sections.map((section) => {
            const isOpen = expandedSection === section.id;
            return (
              <div key={section.id} className="overflow-hidden rounded-[14px] border border-[#ededec] bg-[#fcfcfb]">
                <button
                  onClick={() => setExpandedSection(isOpen ? null : section.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#f0f4f8]"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: section.color }} />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-medium text-[#1a1a2e]">{section.label}</p>
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: section.color + '15', color: section.color }}
                        >
                          {section.difficulty}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#8a8a9a]">{section.description}</p>
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
                  <div className="space-y-3 border-t border-[#ededec] px-4 py-4">
                    <div>
                      <p className="mb-2 text-[12px] font-medium text-[#3d5a80]">Question Types</p>
                      <div className="flex flex-wrap gap-1.5">
                        {section.questionTypes.map((qt) => (
                          <span key={qt} className="rounded-full bg-[#f0f4f8] px-2.5 py-1 text-[11px] font-medium text-[#3d5a80]">
                            {qt}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-[12px] font-medium text-[#2d6a4f]">Tips</p>
                      <div className="space-y-1.5">
                        {section.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2.5 rounded-lg bg-[#f0f8f4]/50 p-2.5">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#2d6a4f]/10 text-[10px] font-medium text-[#2d6a4f]">
                              {i + 1}
                            </span>
                            <p className="text-[12px] text-[#1a1a2e]">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Common Mistakes */}
          <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
            <p className="mb-3 text-[14px] font-medium text-[#a33030]">Common Mistakes</p>
            <div className="space-y-2.5">
              {techniques.commonMistakes.map((m, i) => (
                <div key={i} className="rounded-xl bg-[#fef5f5]/50 p-3">
                  <p className="text-[13px] font-medium text-[#1a1a2e]">{m.mistake}</p>
                  <p className="mt-1 text-[12px] text-[#8a8a9a]">{m.fix}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'strategies' && (
        <div className="space-y-3">
          {techniques.generalStrategies.map((strategy) => {
            const isOpen = expandedStrategy === strategy.id;
            return (
              <div key={strategy.id} className="overflow-hidden rounded-[14px] border border-[#ededec] bg-[#fcfcfb]">
                <button
                  onClick={() => setExpandedStrategy(isOpen ? null : strategy.id)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[#f0f4f8]"
                >
                  <div>
                    <p className="text-[14px] font-medium text-[#1a1a2e]">{strategy.label}</p>
                    <p className="text-[12px] text-[#8a8a9a]">{strategy.description}</p>
                  </div>
                  <svg
                    className={`h-4 w-4 shrink-0 text-[#b0b0b8] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-[#ededec] px-4 py-3 space-y-1.5">
                    {strategy.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5 rounded-lg bg-[#f0f4f8]/50 p-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#3d5a80]/10 text-[10px] font-medium text-[#3d5a80]">
                          {i + 1}
                        </span>
                        <p className="text-[12px] text-[#1a1a2e]">{step}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'practice' && (
        <div className="space-y-6">
          {/* Spelling Drill */}
          <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-[14px] font-medium text-[#1a1a2e]">Spelling Drill</p>
              <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[11px] font-medium text-[#3d5a80]">
                {spellingScore.correct}/{spellingScore.total} correct
              </span>
            </div>
            <p className="mb-4 text-[12px] text-[#8a8a9a]">
              Common IELTS words that are frequently misspelled. Type the correct spelling.
            </p>

            <div className="rounded-xl bg-[#f0f4f8] p-4 text-center">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#3d5a80]">
                Word {spellingIndex + 1} of {spellingWords.words!.length}
              </p>
              <p className="mt-2 text-[13px] text-[#9a6b20]">
                Hint: {spellingWords.words![spellingIndex].trap}
              </p>

              {!spellingRevealed ? (
                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    value={spellingInput}
                    onChange={(e) => setSpellingInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && spellingInput && checkSpelling()}
                    placeholder="Type the word..."
                    className="mx-auto block w-full max-w-xs rounded-lg border border-[#ededec] bg-white px-3 py-2.5 text-center text-[14px] text-[#1a1a2e] placeholder:text-[#b0b0b8] focus:border-[#3d5a80] focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={checkSpelling}
                    disabled={!spellingInput}
                    className="rounded-xl bg-[#3d5a80] px-6 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#34506f] disabled:opacity-40"
                  >
                    Check
                  </button>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  <p className={`text-[18px] font-medium ${
                    spellingInput.trim().toLowerCase() === spellingWords.words![spellingIndex].word.toLowerCase()
                      ? 'text-[#2d6a4f]' : 'text-[#a33030]'
                  }`}>
                    {spellingInput.trim().toLowerCase() === spellingWords.words![spellingIndex].word.toLowerCase()
                      ? 'Correct!'
                      : `Wrong — it's "${spellingWords.words![spellingIndex].word}"`}
                  </p>
                  <button
                    onClick={nextSpellingWord}
                    className="rounded-xl bg-[#3d5a80] px-6 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#34506f]"
                  >
                    Next Word
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Number Confusion Drill */}
          <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
            <p className="mb-1 text-[14px] font-medium text-[#1a1a2e]">Number Confusion Drill</p>
            <p className="mb-4 text-[12px] text-[#8a8a9a]">
              Practice distinguishing commonly confused numbers (e.g., fifteen vs fifty).
            </p>

            <div className="rounded-xl bg-[#fef9f0] p-4 text-center">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#9a6b20]">
                Pair {numberIndex + 1} of {numberPairs.pairs!.length}
              </p>
              <div className="mt-3 flex items-center justify-center gap-6">
                <span className="rounded-xl bg-white px-5 py-3 text-[24px] font-medium text-[#1a1a2e] shadow-sm">
                  {numberPairs.pairs![numberIndex].a}
                </span>
                <span className="text-[16px] text-[#b0b0b8]">vs</span>
                <span className="rounded-xl bg-white px-5 py-3 text-[24px] font-medium text-[#1a1a2e] shadow-sm">
                  {numberPairs.pairs![numberIndex].b}
                </span>
              </div>

              <button
                onClick={() => setNumberRevealed(!numberRevealed)}
                className="mt-3 text-[13px] font-medium text-[#9a6b20] hover:underline"
              >
                {numberRevealed ? 'Hide tip' : 'Show pronunciation tip'}
              </button>

              {numberRevealed && (
                <p className="mt-2 rounded-lg bg-white p-3 text-[13px] text-[#1a1a2e]">
                  {numberPairs.pairs![numberIndex].tip}
                </p>
              )}

              <div className="mt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setNumberIndex((i) => (i > 0 ? i - 1 : numberPairs.pairs!.length - 1));
                    setNumberRevealed(false);
                  }}
                  className="rounded-lg border border-[#ededec] bg-white px-4 py-2 text-[12px] font-medium text-[#8a8a9a] hover:bg-[#f0f4f8]"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    setNumberIndex((i) => (i + 1) % numberPairs.pairs!.length);
                    setNumberRevealed(false);
                  }}
                  className="rounded-lg bg-[#9a6b20] px-4 py-2 text-[12px] font-medium text-white hover:bg-[#8a5b10]"
                >
                  Next Pair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
