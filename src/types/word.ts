export type Topic =
  | 'academic'
  | 'environment'
  | 'society'
  | 'technology'
  | 'health'
  | 'education'
  | 'economy';

export const TOPIC_LABELS: Record<Topic, string> = {
  academic: 'Academic Core',
  environment: 'Environment',
  society: 'Society',
  technology: 'Technology',
  health: 'Health',
  education: 'Education',
  economy: 'Economy',
};

export interface Word {
  word: string;
  slug: string;
  pos: string;
  definition: string;
  example: string;
  exampleAlt: string;
  topic: Topic;
  difficulty: 1 | 2 | 3;
  collocations: string[];
  synonyms: string[];
  ieltsRelevance: string;
  tutorExplanation: string;
  writingTip: string;
  speakingTip: string;
  commonMistake: string;
}
