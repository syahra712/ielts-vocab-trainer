/**
 * Generates new IELTS vocab entries via Groq and appends them to src/data/words/<topic>.json.
 * Usage: npx tsx scripts/generate-vocab.ts --topic technology --count 10
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const TOPICS = ['academic', 'economy', 'education', 'environment', 'health', 'society', 'technology'] as const;
type Topic = (typeof TOPICS)[number];

function loadGroqKey(): string {
  if (process.env.GROQ_API_KEY) return process.env.GROQ_API_KEY;

  const candidates = [
    join(homedir(), 'Desktop', 'Mbazu research', 'false_precision', '.keys.env'),
    join(homedir(), 'Desktop', 'Research', 'error_begets_error', '.keys.env'),
  ];
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const contents = readFileSync(path, 'utf-8');
    const match = contents.match(/^(?:export\s+)?GROQ_API_KEY\s*=\s*"?([^"\n]+)"?/m);
    if (match) return match[1].trim();
  }
  throw new Error(
    'GROQ_API_KEY not found in env or in the known research .keys.env files. Set it explicitly: GROQ_API_KEY=... npx tsx scripts/generate-vocab.ts',
  );
}

function parseArgs() {
  const args = process.argv.slice(2);
  const topicIdx = args.indexOf('--topic');
  const countIdx = args.indexOf('--count');
  const topic = (topicIdx >= 0 ? args[topicIdx + 1] : '') as Topic;
  const count = countIdx >= 0 ? parseInt(args[countIdx + 1], 10) : 10;

  if (!TOPICS.includes(topic)) {
    throw new Error(`--topic must be one of: ${TOPICS.join(', ')}`);
  }
  if (!count || count < 1 || count > 25) {
    throw new Error('--count must be between 1 and 25');
  }
  return { topic, count };
}

/** Groq tends to echo the headword's capitalisation into inline <b> usage even
 * mid-sentence. Lowercase it unless the tag genuinely opens the sentence. */
function fixInlineCasing(text: string, word: string): string {
  const re = new RegExp(`<b>${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</b>`, 'gi');
  return text.replace(re, (match, offset: number) => {
    const atSentenceStart = offset === 0;
    const inner = word.charAt(0)[atSentenceStart ? 'toUpperCase' : 'toLowerCase']() + word.slice(1).toLowerCase();
    return `<b>${inner}</b>`;
  });
}

function slugify(word: string): string {
  return word.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

type WordEntry = {
  word: string;
  slug: string;
  pos: string;
  definition: string;
  example: string;
  exampleAlt: string;
  topic: Topic;
  difficulty: number;
  collocations: string[];
  synonyms: string[];
  ieltsRelevance: string;
  tutorExplanation: string;
  writingTip: string;
  speakingTip: string;
  commonMistake: string;
};

const SYSTEM_PROMPT = `You are an IELTS Band 8+ vocabulary content writer. You generate advanced vocabulary entries for Writing Task 2 and Speaking Part 3, in the exact JSON schema requested. Always respond with a single JSON object and nothing else — no markdown fences, no commentary.`;

function buildUserPrompt(topic: Topic, count: number, existingWords: string[]): string {
  return `Generate ${count} advanced (IELTS Band 7-9) vocabulary words for the topic "${topic}".

Do NOT reuse any of these existing words: ${existingWords.join(', ') || '(none yet)'}.

Return JSON in exactly this shape:
{
  "words": [
    {
      "word": "Capitalised headword",
      "pos": "adj./v./n./adv. etc.",
      "definition": "One clear sentence definition.",
      "example": "A natural sentence using the word, wrapped in <b></b> tags around the word.",
      "exampleAlt": "A second, different example sentence, also with <b></b> around the word.",
      "difficulty": 1-3 (1=solid Band 6-7, 2=strong Band 7-8, 3=Band 8-9),
      "collocations": ["3-4 common collocations using this word"],
      "synonyms": ["2-3 synonyms"],
      "ieltsRelevance": "e.g. 'Writing Task 2, Speaking Part 3'",
      "tutorExplanation": "A casual, memorable one-sentence explanation like you'd give a student, using an analogy — not a dictionary definition repeat.",
      "writingTip": "One full example sentence showing the word used well in a Task 2 essay context.",
      "speakingTip": "Pronunciation guide (e.g. 'pronounced PRAG-mat-ik') plus a natural way to drop it into a Speaking Part 3 answer.",
      "commonMistake": "A specific, real mistake students make with this word (confusion with a similar word, wrong preposition, wrong register, etc.)."
    }
  ]
}

Only output the JSON object.`;
}

async function callGroq(apiKey: string, topic: Topic, count: number, existingWords: string[]): Promise<WordEntry[]> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/gpt-oss-120b',
      temperature: 0.8,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(topic, count, existingWords) },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq API error ${res.status}: ${body}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Groq returned no content');

  const parsed = JSON.parse(content);
  const rawWords = parsed.words;
  if (!Array.isArray(rawWords)) throw new Error('Groq response missing "words" array');

  return rawWords.map((w: Omit<WordEntry, 'slug' | 'topic'>) => ({
    ...w,
    example: fixInlineCasing(w.example, w.word),
    exampleAlt: fixInlineCasing(w.exampleAlt, w.word),
    writingTip: fixInlineCasing(w.writingTip, w.word),
    speakingTip: fixInlineCasing(w.speakingTip, w.word),
    slug: slugify(w.word),
    topic,
  }));
}

function validateEntry(entry: WordEntry): string[] {
  const problems: string[] = [];
  const required: (keyof WordEntry)[] = [
    'word', 'slug', 'pos', 'definition', 'example', 'exampleAlt', 'topic',
    'difficulty', 'collocations', 'synonyms', 'ieltsRelevance',
    'tutorExplanation', 'writingTip', 'speakingTip', 'commonMistake',
  ];
  for (const key of required) {
    if (entry[key] === undefined || entry[key] === null || entry[key] === '') {
      problems.push(`missing "${key}"`);
    }
  }
  if (!Array.isArray(entry.collocations) || entry.collocations.length === 0) problems.push('empty collocations');
  if (!Array.isArray(entry.synonyms) || entry.synonyms.length === 0) problems.push('empty synonyms');
  if (typeof entry.difficulty !== 'number' || entry.difficulty < 1 || entry.difficulty > 3) problems.push('difficulty out of range');
  return problems;
}

async function main() {
  const { topic, count } = parseArgs();
  const apiKey = loadGroqKey();

  const wordsDir = join(__dirname, '..', 'src', 'data', 'words');
  const filePath = join(wordsDir, `${topic}.json`);
  const existing: WordEntry[] = JSON.parse(readFileSync(filePath, 'utf-8'));

  // Firestore keys the `words` collection by slug regardless of topic file,
  // so a duplicate slug in ANY topic would silently overwrite that word's doc.
  const allSlugs = new Set<string>();
  for (const file of readdirSync(wordsDir).filter((f) => f.endsWith('.json'))) {
    const words: WordEntry[] = JSON.parse(readFileSync(join(wordsDir, file), 'utf-8'));
    for (const w of words) allSlugs.add(w.slug);
  }
  const existingWords = existing.map((w) => w.word);

  console.log(`Generating ${count} words for topic "${topic}" via Groq...`);
  let generated: WordEntry[] = [];
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      generated = await callGroq(apiKey, topic, count, existingWords);
      break;
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      console.log(`  attempt ${attempt} failed (${(err as Error).message.slice(0, 80)}...), retrying...`);
    }
  }

  const accepted: WordEntry[] = [];
  const rejected: { word: string; reason: string }[] = [];

  for (const entry of generated) {
    const problems = validateEntry(entry);
    if (problems.length > 0) {
      rejected.push({ word: entry.word ?? '(unknown)', reason: problems.join(', ') });
      continue;
    }
    if (allSlugs.has(entry.slug)) {
      rejected.push({ word: entry.word, reason: `duplicate slug "${entry.slug}" (already exists in word bank)` });
      continue;
    }
    allSlugs.add(entry.slug);
    accepted.push(entry);
  }

  if (accepted.length > 0) {
    const merged = [...existing, ...accepted];
    writeFileSync(filePath, JSON.stringify(merged, null, 2) + '\n');
  }

  console.log(`\nAdded ${accepted.length} word(s) to ${filePath}:`);
  for (const w of accepted) console.log(`  + ${w.word} (${w.slug})`);

  if (rejected.length > 0) {
    console.log(`\nSkipped ${rejected.length}:`);
    for (const r of rejected) console.log(`  - ${r.word}: ${r.reason}`);
  }

  console.log('\nReview the diff, then run `npm run seed` (or just push — the build auto-seeds) to push to Firestore.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
