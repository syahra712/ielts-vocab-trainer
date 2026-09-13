import { AuthGuard } from '@/components/auth/AuthGuard';
import { BottomNav } from '@/components/navigation/BottomNav';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#fcfcfb] pb-20">
        <main className="mx-auto max-w-lg px-4 pt-5">{children}</main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
}
