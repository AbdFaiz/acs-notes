// components/LoginForm.tsx
'use client';

import { useState } from 'react';
import { Mail, Lock, ArrowRight, AlertCircle, Info } from 'lucide-react';
import { loginUser } from '@/actions/noteActions';

type Props = { message?: string };

export default function LoginForm({ message }: Props) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await loginUser(email, password);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  return (
    <div className="card p-8">
      {message && (
        <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl text-sm"
          style={{ background: 'rgba(232,201,122,0.08)', border: '1px solid rgba(232,201,122,0.2)', color: 'var(--accent)' }}>
          <Info size={16} className="mt-0.5 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-3 p-3.5 rounded-xl text-sm"
          style={{ background: 'rgba(224,92,92,0.08)', border: '1px solid rgba(224,92,92,0.2)', color: 'var(--danger)' }}>
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
            Email
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input
              type="email" required autoComplete="email"
              placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5 tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
            Password
          </label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }} />
            <input
              type="password" required autoComplete="current-password"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              className="form-input pl-10"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
          {loading ? 'Signing in…' : (<>Sign in <ArrowRight size={15} /></>)}
        </button>
      </form>
    </div>
  );
}
