'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { useStudySession } from '@/hooks/useStudySession';
import { FlashcardMode } from '@/components/study/FlashcardMode';
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
          No words found. Run the seed script first to populate the word database.
        </p>
      </div>
    );
  }

  return <StudySession words={words} cardStates={cardStates} mode={mode} />;
}

function StudySession({
  words,
  cardStates,
  mode,
}: {
  words: Word[];
  cardStates: Map<string, CardState>;
  mode: StudyMode;
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
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-gray-500 dark:text-gray-400">
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
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-500">Fill-the-gap mode coming soon.</p>
        </div>
      )}

      {mode === 'speed' && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <p className="text-gray-500">Speed quiz mode coming soon.</p>
        </div>
      )}
    </div>
  );
}
