// components/Sidebar.tsx
// Client Component — needs onMouseEnter/Leave for hover styles.
// Receives user data as plain props from the Server layout.
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, LayoutDashboard, PenLine, LogOut } from 'lucide-react';
import { logoutUser } from '@/actions/noteActions';

type Props = { email: string; initials: string };

type NavItem = { href: string; label: string; icon: React.ReactNode };

export default function Sidebar({ email, initials }: Props) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: '/dashboard',     label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { href: '/dashboard/new', label: 'New Note',  icon: <PenLine size={16} /> },
  ];

  return (
    <aside
      className="hidden md:flex flex-col w-60 shrink-0 py-6 px-4"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo */}
      <Link href={`/dashboard`} className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'var(--accent)' }}>
          <BookOpen size={14} color="#0f0f11" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-sm">Daily Notes</span>
      </Link>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon }) => {
          // Exact match for dashboard, prefix match for new/edit
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href);

          return (
           <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-(--text-2) transition-all hover:bg-surface-2 hover:text-text ${
              isActive ? 'bg-surface-2 text-text' : ''
            }`}
          >
            {icon}
            {label}
          </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3 px-2 mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border-2)',
              color: 'var(--accent)',
            }}
          >
            {initials}
          </div>
          <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>{email}</p>
        </div>

        <form action={logoutUser}>
          <button
            type="submit"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all group"
            style={{ color: 'var(--text-3)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(224,92,92,0.08)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-3)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
