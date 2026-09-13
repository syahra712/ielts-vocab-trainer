import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getCredential(): ServiceAccount {
  // Option 1: base64-encoded JSON in env var (for Vercel / CI)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8'),
    ) as ServiceAccount;
  }

  // Option 2: JSON string in env var
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
  }

  // Option 3: local file
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './service-account.json';
  if (existsSync(filePath)) {
    return JSON.parse(readFileSync(filePath, 'utf-8')) as ServiceAccount;
  }

  console.log('No Firebase service account found — skipping seed.');
  console.log('Set FIREBASE_SERVICE_ACCOUNT_BASE64 env var to enable auto-seeding.');
  process.exit(0);
}

initializeApp({ credential: cert(getCredential()) });
const db = getFirestore();

async function seedWords() {
  const wordsDir = join(__dirname, '..', 'src', 'data', 'words');
  const files = readdirSync(wordsDir).filter((f) => f.endsWith('.json'));

  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const file of files) {
    const words = JSON.parse(readFileSync(join(wordsDir, file), 'utf-8'));

    // Firestore batch limit is 500 — process per-file
    const batch = db.batch();
    let batchCount = 0;

    for (const word of words) {
      const ref = db.collection('words').doc(word.slug);
      const existing = await ref.get();

      if (!existing.exists) {
        batch.set(ref, { ...word, createdAt: new Date(), updatedAt: new Date() });
        created++;
        batchCount++;
      } else {
        const data = existing.data()!;
        const changed =
          data.definition !== word.definition ||
          data.example !== word.example ||
          data.topic !== word.topic ||
          data.difficulty !== word.difficulty;

        if (changed) {
          batch.update(ref, { ...word, updatedAt: new Date() });
          updated++;
          batchCount++;
        } else {
          unchanged++;
        }
      }
    }

    if (batchCount > 0) await batch.commit();
  }

  console.log(
    `Seed complete: ${created} created, ${updated} updated, ${unchanged} unchanged (${created + updated + unchanged} total)`,
  );
}

seedWords().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
