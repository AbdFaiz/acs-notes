// components/NoteCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Calendar, ArrowUpRight } from 'lucide-react';
import { deleteNote } from '@/actions/noteActions';
import type { Note, Category } from '@/lib/types';

const BADGE_CLASS: Record<Category, string> = {
  Work:    'badge-work',
  Study:   'badge-study',
  Meeting: 'badge-meeting',
  Other:   'badge-other',
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function NoteCard({ note }: { note: Note }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate to detail
    if (!confirm(`Delete "${note.title}"?`)) return;
    setDeleting(true);
    const result = await deleteNote(note.id);
    if (result?.error) { alert(result.error); setDeleting(false); }
  }

  const categories: Category[] = Array.isArray(note.categories) ? note.categories : [];

  return (
    // Entire card is a link to the detail view
    <div
      className={`card flex flex-col gap-4 p-5 transition-all group ${deleting ? 'opacity-40 pointer-events-none' : ''}`}
      style={{ textDecoration: 'none' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
    >
      {/* Top: categories + date */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {categories.length > 0
            ? categories.map(cat => (
                <span key={cat}
                  className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${BADGE_CLASS[cat]}`}>
                  {cat}
                </span>
              ))
            : <span className="text-xs" style={{ color: 'var(--text-3)' }}>Uncategorized</span>
          }
        </div>
        <div className="flex items-center gap-1.5 text-xs shrink-0" style={{ color: 'var(--text-3)' }}>
          <Calendar size={11} />
          {formatDate(note.activity_date)}
        </div>
      </div>

      {/* Title + description */}
      <Link href={`/dashboard/${note.id}`} className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-base leading-snug line-clamp-2 mb-1.5" style={{ color: 'var(--text)' }}>
            {note.title}
          </h2>
          {/* Arrow icon — appears on hover */}
          <ArrowUpRight size={15} className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: 'var(--text-3)' }} />
        </div>
        {note.description && (
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-3)' }}>
            {note.description}
          </p>
        )}
      </Link>

      {/* Actions — stop propagation so clicks don't open detail */}
      <div className="flex items-center gap-1 pt-3" style={{ borderTop: '1px solid var(--border)' }}
        onClick={e => e.preventDefault()}>
        <Link href={`/dashboard/edit/${note.id}`}
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
          <Pencil size={12} /> Edit
        </Link>
        <button onClick={handleDelete} disabled={deleting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--danger)'; (e.currentTarget as HTMLElement).style.background = 'rgba(224,92,92,0.08)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-3)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
          <Trash2 size={12} /> {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
