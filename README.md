# IELTS Vocab Trainer

A production spaced-repetition trainer for IELTS Band 8+ prep, covering all four sections: Vocabulary, Reading, Writing, Listening, and Speaking.

**Live:** https://ielts-trainer-taupe.vercel.app

## Features

- **Vocabulary** — 146 advanced words across 7 topics (academic, economy, education, environment, health, society, technology), each with a definition, two example sentences, collocations, synonyms, a tutor explanation, writing/speaking tips, and a common-mistake note. Reviewed with an SM-2 spaced-repetition scheduler across flashcard, fill-in-the-gap, and speed-quiz modes.
- **Reading** — interactive passages with comprehension questions.
- **Writing** — Task 2 prompts with guidance.
- **Speaking** — Part 1 question bank (15 topics), Part 2 cue cards with timed prep/speaking practice and Part 3 follow-up discussion, and a phrase bank organized by function (buying time, giving opinions, comparing, speculating, etc.) with band-level tags.
- **Listening** — practice exercises.
- **Progress tracking** — per-word SRS state, streaks, and XP, backed by Firestore.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Firebase (Auth + Firestore) for user accounts and progress persistence
- Deployed on Vercel, auto-seeding Firestore from `src/data/words/*.json` on every build

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll need a `.env.local` with the `NEXT_PUBLIC_FIREBASE_*` client config (see `.env.local.example`) and, to seed locally, a `FIREBASE_SERVICE_ACCOUNT_BASE64` (or `_JSON` / `_PATH`) pointing at a Firebase Admin service account.

## Growing the vocab bank

New words are generated via Groq and merged into `src/data/words/<topic>.json`:

```bash
npx tsx scripts/generate-vocab.ts --topic technology --count 10
```

The generator validates schema, dedupes slugs globally (Firestore keys the `words` collection by slug regardless of topic file), and retries on Groq rate limits.

A [scheduled GitHub Actions workflow](.github/workflows/generate-vocab.yml) runs this weekly across all 7 topics and opens a PR for review — new words never reach Firestore without a merge, since the build step (`npm run build`) reseeds Firestore automatically on every deploy.

## Firestore data model

- `words/{slug}` — global word bank, read-only for clients, written only by the seed script
- `users/{uid}` — profile + settings
- `users/{uid}/cardStates/{slug}` — per-word SM-2 state
- `users/{uid}/reviewLogs/{id}` — append-only review history
- `users/{uid}/dailyStats/{date}` and `users/{uid}/stats/aggregate` — progress rollups

Access is enforced by `firestore.rules` — each user can only read/write their own subtree.
