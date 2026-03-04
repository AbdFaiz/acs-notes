// app/dashboard/layout.tsx

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, PenLine, LogOut } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { logoutUser } from '@/actions/noteActions';
import Sidebar from '@/components/Sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const email    = user.email ?? '';
  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex">

      {/* ── Sidebar (Client Component — handles hover interactions) ── */}
      <Sidebar email={email} initials={initials} />

      {/* ── Mobile top bar ── */}
      {/* This bar has no hover handlers, so it's fine in a Server Component */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 h-14"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent)' }}>
            <BookOpen size={14} color="#0f0f11" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm">Daily Notes</span>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/new" className="btn-primary py-1.5 px-3 text-xs">
            <PenLine size={13} /> New
          </Link>
          <form action={logoutUser}>
            <button type="submit" className="p-2 rounded-lg" style={{ color: 'var(--text-3)' }}>
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* ── Page content ── */}
      <main className="flex-1 min-w-0 px-5 py-8 md:px-8 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}
