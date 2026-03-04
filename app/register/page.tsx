// app/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle, BookOpen, CheckCircle2 } from 'lucide-react';
import { registerUser } from '@/actions/noteActions';

export default function RegisterPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm)  { setError('Passwords do not match'); return; }
    if (password.length < 6)   { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await registerUser(email, password);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  const perks = ['Track daily activities', 'Filter by category', 'Your data stays private'];

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] shrink-0 p-10"
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <BookOpen size={16} color="#0f0f11" strokeWidth={2.5} />
          </div>
          <span className="font-semibold text-sm tracking-wide">Daily Notes</span>
        </div>

        <div>
          <h2 className="text-3xl mb-6 leading-tight" style={{ fontFamily: 'Instrument Serif, serif' }}>
            Start your<br />journaling habit
          </h2>
          <div className="space-y-3">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3">
                <CheckCircle2 size={16} style={{ color: 'var(--study)' }} />
                <span className="text-sm" style={{ color: 'var(--text-2)' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: 'var(--text-3)' }}>Free forever. No credit card required.</p>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <BookOpen size={16} color="#0f0f11" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-sm">Daily Notes</span>
          </div>

          <h1 className="text-3xl mb-1" style={{ fontFamily: 'Instrument Serif, serif' }}>Create account</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-3)' }}>Start tracking your daily activities</p>

          <div className="card p-8">
            {error && (
              <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl text-sm"
                style={{ background: 'rgba(224,92,92,0.08)', border: '1px solid rgba(224,92,92,0.2)', color: 'var(--danger)' }}>
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                  <input type="email" required autoComplete="email" placeholder="you@example.com"
                    value={email} onChange={e => setEmail(e.target.value)} className="form-input pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                  <input type="password" required autoComplete="new-password" placeholder="Min. 6 characters"
                    value={password} onChange={e => setPassword(e.target.value)} className="form-input pl-10" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>Confirm Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
                  <input type="password" required autoComplete="new-password" placeholder="Repeat your password"
                    value={confirm} onChange={e => setConfirm(e.target.value)} className="form-input pl-10" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
                {loading ? 'Creating account…' : (<>Create account <ArrowRight size={15} /></>)}
              </button>
            </form>
          </div>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-3)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:underline transition-colors" style={{ color: 'var(--accent)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
