import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { initializeApp, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './service-account.json';
const serviceAccount = JSON.parse(
  readFileSync(serviceAccountPath, 'utf-8'),
) as ServiceAccount;

initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function seedWords() {
  const wordsDir = join(__dirname, '..', 'src', 'data', 'words');
  const files = readdirSync(wordsDir).filter((f) => f.endsWith('.json'));

  let total = 0;
  const batch = db.batch();

  for (const file of files) {
    const words = JSON.parse(readFileSync(join(wordsDir, file), 'utf-8'));
    for (const word of words) {
      const ref = db.collection('words').doc(word.slug);
      batch.set(ref, {
        ...word,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      total++;
    }
  }

  await batch.commit();
  console.log(`Seeded ${total} words from ${files.length} topic files.`);
}

seedWords().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
