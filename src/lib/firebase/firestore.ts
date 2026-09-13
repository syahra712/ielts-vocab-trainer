import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  increment,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './config';
import type { CardState } from '@/types/session';

export async function getCardState(
  uid: string,
  slug: string,
): Promise<CardState | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'cardStates', slug));
  return snap.exists() ? (snap.data() as CardState) : null;
}

export async function getAllCardStates(uid: string): Promise<CardState[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'cardStates'));
  return snap.docs.map((d) => d.data() as CardState);
}

export async function updateCardState(
  uid: string,
  slug: string,
  state: Partial<CardState>,
): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'cardStates', slug), state, {
    merge: true,
  });
}

export async function addReviewLog(
  uid: string,
  log: DocumentData,
): Promise<void> {
  await addDoc(collection(db, 'users', uid, 'reviewLogs'), {
    ...log,
    timestamp: serverTimestamp(),
  });
}

export async function updateDailyStats(
  uid: string,
  date: string,
  updates: {
    wordsReviewed?: number;
    wordsCorrect?: number;
    wordsNew?: number;
    xpEarned?: number;
  },
): Promise<void> {
  const ref = doc(db, 'users', uid, 'dailyStats', date);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      date,
      wordsReviewed: updates.wordsReviewed ?? 0,
      wordsCorrect: updates.wordsCorrect ?? 0,
      wordsNew: updates.wordsNew ?? 0,
      xpEarned: updates.xpEarned ?? 0,
      sessionsCompleted: 0,
      studyTimeSeconds: 0,
    });
  } else {
    const inc: DocumentData = {};
    if (updates.wordsReviewed) inc.wordsReviewed = increment(updates.wordsReviewed);
    if (updates.wordsCorrect) inc.wordsCorrect = increment(updates.wordsCorrect);
    if (updates.wordsNew) inc.wordsNew = increment(updates.wordsNew);
    if (updates.xpEarned) inc.xpEarned = increment(updates.xpEarned);
    if (Object.keys(inc).length > 0) await updateDoc(ref, inc);
  }
}

export async function updateAggregateStats(
  uid: string,
  updates: DocumentData,
): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'stats', 'aggregate'), updates, {
    merge: true,
  });
}
