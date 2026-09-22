'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import passages from '@/data/reading/passages.json';

type AnswerState = Record<string, string | number | null>;

export default function ReadingPracticePage() {
  const params = useParams();
  const passageId = params.passageId as string;
  const passage = passages.find((p) => p.id === passageId);

  const [showPassage, setShowPassage] = useState(true);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [showResults, setShowResults] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const [intervalRef] = useState<{ current: ReturnType<typeof setInterval> | undefined }>({ current: undefined });

  function startTimer() {
    if (timerRunning) return;
    setTimerRunning(true);
    intervalRef.current = setInterval(() => {
      setSecondsElapsed((s) => s + 1);
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerRunning(false);
  }

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;

  if (!passage) {
    return (
      <div className="mx-auto max-w-xl rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-8 text-center">
        <p className="text-[13px] text-[#8a8a9a]">Passage not found.</p>
        <Link href="/reading" className="mt-3 inline-block text-[13px] text-[#3d5a80] hover:underline">
          Back to Reading
        </Link>
      </div>
    );
  }

  const totalQuestions = passage.questions.reduce((acc, q) => acc + q.items.length, 0);
  let correctCount = 0;
  if (showResults) {
    let qIdx = 0;
    passage.questions.forEach((qGroup) => {
      qGroup.items.forEach((item) => {
        const key = `q-${qIdx}`;
        const userAnswer = answers[key];
        if (qGroup.type === 'multiple-choice') {
          const mc = item as { answer: number };
          if (userAnswer === mc.answer) correctCount++;
        } else if (qGroup.type === 'matching-headings') {
          const mh = item as { heading: string };
          if (userAnswer === mh.heading) correctCount++;
        } else {
          const tf = item as { answer: string };
          if (typeof userAnswer === 'string' && userAnswer.toUpperCase() === tf.answer.toUpperCase()) correctCount++;
        }
        qIdx++;
      });
    });
  }

  function handleSubmit() {
    stopTimer();
    setShowResults(true);
  }

  function handleReset() {
    setAnswers({});
    setShowResults(false);
    setSecondsElapsed(0);
  }

  const difficultyLabel = passage.difficulty === 1 ? 'Easy' : passage.difficulty === 2 ? 'Medium' : 'Hard';
  const difficultyColor = passage.difficulty === 1 ? '#2d6a4f' : passage.difficulty === 2 ? '#9a6b20' : '#a33030';

  let questionIndex = 0;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link href="/reading" className="inline-flex items-center gap-1.5 text-[13px] text-[#8a8a9a] hover:text-[#3d5a80]">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Reading
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
              style={{ backgroundColor: difficultyColor + '15', color: difficultyColor }}
            >
              {difficultyLabel}
            </span>
            <span className="rounded-full bg-[#f0f4f8] px-2.5 py-0.5 text-[10px] font-medium text-[#3d5a80]">
              {passage.topic}
            </span>
          </div>
          <h1 className="text-[18px] font-medium text-[#1a1a2e]">{passage.title}</h1>
        </div>
        <div className="text-right">
          <p className="text-[20px] font-medium tabular-nums text-[#3d5a80]">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          {!timerRunning && secondsElapsed === 0 && (
            <button onClick={startTimer} className="text-[11px] text-[#3d5a80] hover:underline">
              Start timer
            </button>
          )}
        </div>
      </div>

      {/* Passage toggle */}
      <button
        onClick={() => setShowPassage(!showPassage)}
        className="flex w-full items-center justify-between rounded-xl border border-[#ededec] bg-[#fcfcfb] px-4 py-3 text-left transition-colors hover:bg-[#f0f4f8]"
      >
        <span className="text-[13px] font-medium text-[#3d5a80]">
          {showPassage ? 'Hide passage' : 'Show passage'}
        </span>
        <svg
          className={`h-4 w-4 text-[#3d5a80] transition-transform ${showPassage ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {showPassage && (
        <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
          <div className="prose-sm max-w-none">
            {passage.passage.split('\n\n').map((para, i) => (
              <p key={i} className="mb-3 text-[14px] leading-relaxed text-[#1a1a2e] last:mb-0">{para}</p>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-[#b0b0b8]">{passage.wordCount} words</p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-5">
        {passage.questions.map((qGroup, gIdx) => {
          const groupLabel =
            qGroup.type === 'tfng' ? 'True / False / Not Given' :
            qGroup.type === 'ynng' ? 'Yes / No / Not Given' :
            qGroup.type === 'fill-blanks' ? `Sentence Completion (max ${'wordLimit' in qGroup ? qGroup.wordLimit : 3} words)` :
            qGroup.type === 'multiple-choice' ? 'Multiple Choice' :
            qGroup.type === 'matching-headings' ? 'Matching Headings' : qGroup.type;

          return (
            <div key={gIdx} className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-5">
              <p className="mb-3 text-[13px] font-medium text-[#3d5a80]">{groupLabel}</p>
              <div className="space-y-3">
                {qGroup.items.map((item, iIdx) => {
                  const key = `q-${questionIndex}`;
                  const currentQIdx = questionIndex;
                  questionIndex++;

                  if (qGroup.type === 'tfng' || qGroup.type === 'ynng') {
                    const tfItem = item as { statement: string; answer: string; explanation: string };
                    const options = qGroup.type === 'tfng' ? ['TRUE', 'FALSE', 'NOT GIVEN'] : ['YES', 'NO', 'NOT GIVEN'];
                    const userAnswer = answers[key] as string | undefined;
                    const isCorrect = showResults && userAnswer?.toUpperCase() === tfItem.answer;
                    const isWrong = showResults && userAnswer && userAnswer.toUpperCase() !== tfItem.answer;

                    return (
                      <div key={iIdx} className={`rounded-xl p-3.5 ${showResults ? (isCorrect ? 'bg-[#f0f8f4]' : isWrong ? 'bg-[#fef5f5]' : 'bg-[#f0f4f8]/50') : 'bg-[#f0f4f8]/50'}`}>
                        <p className="mb-2 text-[13px] text-[#1a1a2e]">
                          <span className="mr-2 font-medium text-[#3d5a80]">{currentQIdx + 1}.</span>
                          {tfItem.statement}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => !showResults && setAnswers({ ...answers, [key]: opt })}
                              disabled={showResults}
                              className={`rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                                userAnswer === opt
                                  ? showResults
                                    ? opt === tfItem.answer ? 'bg-[#2d6a4f] text-white' : 'bg-[#a33030] text-white'
                                    : 'bg-[#3d5a80] text-white'
                                  : showResults && opt === tfItem.answer
                                    ? 'border-2 border-[#2d6a4f] bg-white text-[#2d6a4f]'
                                    : 'border border-[#ededec] bg-white text-[#8a8a9a] hover:bg-[#f0f4f8]'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {showResults && (
                          <p className="mt-2 text-[11px] text-[#8a8a9a]">{tfItem.explanation}</p>
                        )}
                      </div>
                    );
                  }

                  if (qGroup.type === 'fill-blanks') {
                    const fbItem = item as { statement: string; answer: string; explanation: string };
                    const userAnswer = (answers[key] as string) || '';
                    const isCorrect = showResults && userAnswer.toLowerCase().trim() === fbItem.answer.toLowerCase();

                    return (
                      <div key={iIdx} className={`rounded-xl p-3.5 ${showResults ? (isCorrect ? 'bg-[#f0f8f4]' : 'bg-[#fef5f5]') : 'bg-[#f0f4f8]/50'}`}>
                        <p className="mb-2 text-[13px] text-[#1a1a2e]">
                          <span className="mr-2 font-medium text-[#3d5a80]">{currentQIdx + 1}.</span>
                          {fbItem.statement}
                        </p>
                        <input
                          type="text"
                          value={userAnswer}
                          onChange={(e) => !showResults && setAnswers({ ...answers, [key]: e.target.value })}
                          disabled={showResults}
                          placeholder="Type your answer..."
                          className="w-full rounded-lg border border-[#ededec] bg-white px-3 py-2 text-[13px] text-[#1a1a2e] placeholder:text-[#b0b0b8] focus:border-[#3d5a80] focus:outline-none disabled:opacity-70"
                        />
                        {showResults && (
                          <p className="mt-2 text-[11px]">
                            <span className={isCorrect ? 'text-[#2d6a4f]' : 'text-[#a33030]'}>
                              {isCorrect ? 'Correct' : `Answer: ${fbItem.answer}`}
                            </span>
                            <span className="text-[#8a8a9a]"> — {fbItem.explanation}</span>
                          </p>
                        )}
                      </div>
                    );
                  }

                  if (qGroup.type === 'multiple-choice') {
                    const mcItem = item as { question: string; options: string[]; answer: number; explanation: string };
                    const userAnswer = answers[key] as number | undefined;
                    return (
                      <div key={iIdx} className={`rounded-xl p-3.5 ${showResults ? (userAnswer === mcItem.answer ? 'bg-[#f0f8f4]' : 'bg-[#fef5f5]') : 'bg-[#f0f4f8]/50'}`}>
                        <p className="mb-2 text-[13px] text-[#1a1a2e]">
                          <span className="mr-2 font-medium text-[#3d5a80]">{currentQIdx + 1}.</span>
                          {mcItem.question}
                        </p>
                        <div className="space-y-1.5">
                          {mcItem.options.map((opt, oIdx) => (
                            <button
                              key={oIdx}
                              onClick={() => !showResults && setAnswers({ ...answers, [key]: oIdx })}
                              disabled={showResults}
                              className={`w-full rounded-lg px-3 py-2 text-left text-[12px] transition-colors ${
                                userAnswer === oIdx
                                  ? showResults
                                    ? oIdx === mcItem.answer ? 'bg-[#2d6a4f] text-white' : 'bg-[#a33030] text-white'
                                    : 'bg-[#3d5a80] text-white'
                                  : showResults && oIdx === mcItem.answer
                                    ? 'border-2 border-[#2d6a4f] bg-white text-[#2d6a4f]'
                                    : 'border border-[#ededec] bg-white text-[#8a8a9a] hover:bg-[#f0f4f8]'
                              }`}
                            >
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </button>
                          ))}
                        </div>
                        {showResults && (
                          <p className="mt-2 text-[11px] text-[#8a8a9a]">{mcItem.explanation}</p>
                        )}
                      </div>
                    );
                  }

                  if (qGroup.type === 'matching-headings') {
                    const mhItem = item as { paragraph: number; heading: string; options: string[] };
                    const userAnswer = answers[key] as string | undefined;
                    const isCorrect = showResults && userAnswer === mhItem.heading;
                    return (
                      <div key={iIdx} className={`rounded-xl p-3.5 ${showResults ? (isCorrect ? 'bg-[#f0f8f4]' : 'bg-[#fef5f5]') : 'bg-[#f0f4f8]/50'}`}>
                        <p className="mb-2 text-[13px] font-medium text-[#1a1a2e]">
                          <span className="mr-2 text-[#3d5a80]">{currentQIdx + 1}.</span>
                          Paragraph {mhItem.paragraph}
                        </p>
                        <div className="space-y-1.5">
                          {mhItem.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => !showResults && setAnswers({ ...answers, [key]: opt })}
                              disabled={showResults}
                              className={`w-full rounded-lg px-3 py-2 text-left text-[12px] transition-colors ${
                                userAnswer === opt
                                  ? showResults
                                    ? opt === mhItem.heading ? 'bg-[#2d6a4f] text-white' : 'bg-[#a33030] text-white'
                                    : 'bg-[#3d5a80] text-white'
                                  : showResults && opt === mhItem.heading
                                    ? 'border-2 border-[#2d6a4f] bg-white text-[#2d6a4f]'
                                    : 'border border-[#ededec] bg-white text-[#8a8a9a] hover:bg-[#f0f4f8]'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        {showResults && !isCorrect && (
                          <p className="mt-2 text-[11px] text-[#a33030]">Correct: {mhItem.heading}</p>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit / Results */}
      {!showResults ? (
        <button
          onClick={handleSubmit}
          className="w-full rounded-xl bg-[#3d5a80] py-3.5 text-[14px] font-medium text-white transition-colors hover:bg-[#34506f]"
        >
          Check Answers
        </button>
      ) : (
        <div className="rounded-[14px] bg-[#f0f4f8] p-5 text-center">
          <p className="text-[24px] font-medium text-[#3d5a80]">
            {correctCount}/{totalQuestions}
          </p>
          <p className="mt-1 text-[13px] text-[#8a8a9a]">
            {correctCount === totalQuestions
              ? 'Perfect score!'
              : correctCount >= totalQuestions * 0.7
              ? 'Good work! Review the explanations for the ones you missed.'
              : 'Keep practicing. Read the explanations carefully.'}
          </p>
          <p className="mt-1 text-[12px] text-[#b0b0b8]">
            Time: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          <div className="mt-3 flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="rounded-xl border border-[#ededec] bg-white px-5 py-2 text-[13px] font-medium text-[#3d5a80] hover:bg-[#f0f4f8]"
            >
              Try Again
            </button>
            <Link
              href="/reading"
              className="rounded-xl bg-[#3d5a80] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#34506f]"
            >
              More Passages
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
