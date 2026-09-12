'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          IELTS Vocab
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Master 500+ words with spaced repetition
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-gray-700 dark:bg-gray-800/80">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Track your progress across devices.
            <br />
            Sign in to get started.
          </p>
        </div>
        <GoogleSignInButton />
      </div>

      <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
        Your data is stored securely in Firebase.
      </p>
    </div>
  );
}
