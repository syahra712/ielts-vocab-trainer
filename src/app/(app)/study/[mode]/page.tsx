'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useStudySession } from '@/hooks/useStudySession';
import { FlashcardMode } from '@/components/study/FlashcardMode';
import { FillGapMode } from '@/components/study/FillGapMode';
import { SpeedQuizMode } from '@/components/study/SpeedQuizMode';
import { SessionProgress } from '@/components/study/SessionProgress';
import { SessionComplete } from '@/components/study/SessionComplete';
import { getAllWords, getAllCardStates } from '@/lib/firebase/firestore';
import type { Word } from '@/types/word';
import type { CardState, StudyMode } from '@/types/session';

export default function StudyModePage() {
  const params = useParams();
  const mode = (params.mode as string) as StudyMode;
  const { user } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [cardStates, setCardStates] = useState<Map<string, CardState>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [w, cs] = await Promise.all([
        getAllWords(),
        getAllCardStates(user!.uid),
      ]);
      setWords(w);
      const map = new Map<string, CardState>();
      cs.forEach((c) => map.set(c.wordSlug, c));
      setCardStates(map);
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3d5a80] border-t-transparent" />
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-8 text-center">
        <p className="text-[13px] text-[#8a8a9a]">
          No words found. Run the seed script first to populate the word database.
        </p>
      </div>
    );
  }

  return <StudySession words={words} cardStates={cardStates} mode={mode} allWords={words} />;
}

function StudySession({
  words,
  cardStates,
  mode,
  allWords,
}: {
  words: Word[];
  cardStates: Map<string, CardState>;
  mode: StudyMode;
  allWords: Word[];
}) {
  const session = useStudySession(words, cardStates, mode);

  if (session.finished) {
    return (
      <SessionComplete
        correctCount={session.correctCount}
        total={session.total}
        totalXp={session.totalXp}
        results={session.results}
      />
    );
  }

  if (!session.current) {
    return (
      <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-8 text-center">
        <p className="text-[13px] text-[#8a8a9a]">
          No words due for review right now. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div>
      <SessionProgress
        current={session.currentIndex}
        total={session.total}
        correctCount={session.correctCount}
        totalXp={session.totalXp}
      />

      {mode === 'flashcard' && (
        <FlashcardMode
          key={session.current.word.slug}
          word={session.current.word}
          onAnswer={(params) =>
            session.submitAnswer({
              correct: params.correct,
              knewIt: params.knewIt,
              responseTimeMs: params.responseTimeMs,
            })
          }
        />
      )}

      {mode === 'fill-gap' && (
        <FillGapMode
          key={session.current.word.slug}
          word={session.current.word}
          onAnswer={(params) =>
            session.submitAnswer({
              correct: params.correct,
              responseTimeMs: params.responseTimeMs,
            })
          }
        />
      )}

      {mode === 'speed' && (
        <SpeedQuizMode
          key={session.current.word.slug}
          word={session.current.word}
          allWords={allWords}
          onAnswer={(params) =>
            session.submitAnswer({
              correct: params.correct,
              responseTimeMs: params.responseTimeMs,
              timedOut: params.timedOut,
              timeRemainingPct: params.timeRemainingPct,
            })
          }
        />
      )}
    </div>
  );
}
