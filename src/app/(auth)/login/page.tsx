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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fcfcfb] px-4">
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-medium tracking-tight text-[#1a1a2e]">
          IELTS Vocab
        </h1>
        <p className="text-sm text-[#8a8a9a]">
          Master 500+ words with spaced repetition
        </p>
      </div>

      <div className="w-full max-w-sm rounded-[14px] border border-[#ededec] bg-[#f0f4f8] p-8">
        <p className="mb-6 text-center text-sm text-[#8a8a9a]">
          Track your progress across devices.
          <br />
          Sign in to get started.
        </p>
        <GoogleSignInButton />
      </div>

      <p className="mt-6 text-xs text-[#b0b0b8]">
        Your data is stored securely in Firebase.
      </p>
    </div>
  );
}
