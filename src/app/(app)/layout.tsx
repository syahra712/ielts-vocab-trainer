import { AuthGuard } from '@/components/auth/AuthGuard';
import { BottomNav } from '@/components/navigation/BottomNav';
import type { ReactNode } from 'react';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#fcfcfb] pb-20 md:pb-0 md:pl-64">
        <BottomNav />
        <main className="mx-auto max-w-4xl px-4 py-5 md:px-8 md:py-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
