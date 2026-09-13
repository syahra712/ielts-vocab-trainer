import type { Word } from '@/types/word';

import academicWords from './academic.json';
import environmentWords from './environment.json';
import societyWords from './society.json';
import technologyWords from './technology.json';
import healthWords from './health.json';
import educationWords from './education.json';
import economyWords from './economy.json';

export const ALL_WORDS: Word[] = [
  ...academicWords,
  ...environmentWords,
  ...societyWords,
  ...technologyWords,
  ...healthWords,
  ...educationWords,
  ...economyWords,
] as Word[];

export function getWordsByTopic(topic: string): Word[] {
  return ALL_WORDS.filter((w) => w.topic === topic);
}

export function getWord(slug: string): Word | undefined {
  return ALL_WORDS.find((w) => w.slug === slug);
}

export const TOPIC_COUNTS: Record<string, number> = {};
for (const w of ALL_WORDS) {
  TOPIC_COUNTS[w.topic] = (TOPIC_COUNTS[w.topic] ?? 0) + 1;
}
