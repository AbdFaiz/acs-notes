// components/FilterBar.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { X } from 'lucide-react';

const CATEGORIES = ['all', 'Work', 'Study', 'Meeting', 'Other'];

const DOT_COLORS: Record<string, string> = {
  Work: 'var(--work)',
  Study: 'var(--study)',
  Meeting: 'var(--meeting)',
  Other: 'var(--other)',
};

type Props = { activeCategory: string; activeDate: string };

export default function FilterBar({ activeCategory, activeDate }: Props) {
  const router   = useRouter();
  const pathname = usePathname();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams();
    if (key !== 'category' && activeCategory && activeCategory !== 'all') params.set('category', activeCategory);
    if (key !== 'date' && activeDate) params.set('date', activeDate);
    if (value && value !== 'all') params.set(key, value);
    const search = params.toString();
    router.push(`${pathname}${search ? '?' + search : ''}`);
  }

  const hasFilters = (activeCategory && activeCategory !== 'all') || activeDate;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {/* Category pills */}
      {CATEGORIES.map(cat => {
        const isActive = cat === 'all'
          ? (!activeCategory || activeCategory === 'all')
          : activeCategory === cat;

        return (
          <button key={cat} onClick={() => setParam('category', cat)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: isActive ? (cat === 'all' ? 'var(--accent)' : 'var(--surface-2)') : 'var(--surface)',
              color: isActive ? (cat === 'all' ? '#0f0f11' : 'var(--text)') : 'var(--text-3)',
              border: `1px solid ${isActive ? (cat === 'all' ? 'var(--accent)' : 'var(--border-2)') : 'var(--border)'}`,
            }}>
            {cat !== 'all' && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: DOT_COLORS[cat], opacity: isActive ? 1 : 0.5 }} />
            )}
            {cat === 'all' ? 'All' : cat}
          </button>
        );
      })}

      {/* Spacer */}
      <div className="flex-1 min-w-4" />

      {/* Date input */}
      <input type="date"
        value={activeDate}
        onChange={e => setParam('date', e.target.value)}
        className="text-xs px-3 py-1.5 rounded-full transition-all focus:outline-none"
        style={{
          background: activeDate ? 'var(--surface-2)' : 'var(--surface)',
          border: `1px solid ${activeDate ? 'var(--border-2)' : 'var(--border)'}`,
          color: activeDate ? 'var(--text)' : 'var(--text-3)',
        }}
      />

      {/* Clear */}
      {hasFilters && (
        <button onClick={() => router.push(pathname)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all"
          style={{ color: 'var(--text-3)', border: '1px solid var(--border)', background: 'var(--surface)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(224,92,92,0.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
          <X size={11} /> Clear
        </button>
      )}
    </div>
  );
}
