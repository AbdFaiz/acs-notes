// app/login/page.tsx
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import LoginForm from '@/components/LoginForm';

type Props = { searchParams: Promise<{ message?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { message } = await searchParams;

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent)' }}>
            <BookOpen size={16} color="#0f0f11" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm tracking-wide">Daily Notes</span>
        </div>

        <div>
          <blockquote className="text-3xl leading-snug mb-6" style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--text)' }}>
            "The faintest ink is more powerful than the strongest memory."
          </blockquote>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>— Chinese Proverb</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {['Work', 'Study', 'Meeting'].map((cat) => (
            <div key={cat} className="rounded-xl p-3" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
              <div className="text-xs mb-1" style={{ color: 'var(--text-3)' }}>{cat}</div>
              <div className="h-1.5 rounded-full" style={{
                background: cat === 'Work' ? 'var(--work)' : cat === 'Study' ? 'var(--study)' : 'var(--meeting)',
                opacity: 0.6
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <BookOpen size={16} color="#0f0f11" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-sm">Daily Notes</span>
          </div>

          <h1 className="text-3xl mb-1" style={{ fontFamily: 'Instrument Serif, serif' }}>Welcome back</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>Sign in to continue tracking your day</p>

          <LoginForm message={message} />

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-3)' }}>
            No account?{' '}
            <Link href="/register" className="font-medium transition-colors hover:underline" style={{ color: 'var(--accent)' }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
