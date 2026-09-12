import { AuthGuard } from '@/components/auth/AuthGuard';
import { BottomNav } from '@/components/navigation/BottomNav';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 pb-20 dark:bg-gray-950">
        <main className="mx-auto max-w-lg px-4 pt-6">{children}</main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
