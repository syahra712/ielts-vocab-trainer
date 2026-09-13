'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { signOut } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.replace('/login');
  }

  return (
    <div className="space-y-5">
      <h1 className="text-[22px] font-medium text-[#1a1a2e]">
        Settings
      </h1>

      <div className="rounded-[14px] border border-[#ededec] bg-[#fcfcfb] p-4">
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt=""
              className="h-10 w-10 rounded-full"
              referrerPolicy="no-referrer"
            />
          )}
          <div>
            <p className="text-[14px] font-medium text-[#1a1a2e]">
              {user?.displayName}
            </p>
            <p className="text-[12px] text-[#8a8a9a]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="w-full rounded-xl border border-[#a33030]/20 bg-[#fcfcfb] px-4 py-3 text-[13px] font-medium text-[#a33030] transition-colors hover:bg-[#fdf0f0]"
      >
        Sign out
      </button>
    </div>
  );
}
