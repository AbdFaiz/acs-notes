// components/NoteCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, Calendar, Tag } from 'lucide-react';
import { deleteNote } from '@/actions/noteActions';
import type { Note, Category } from '@/lib/types';

const BADGE_CLASS: Record<Category, string> = {
  Work: 'badge-work',
  Study: 'badge-study',
  Meeting: 'badge-meeting',
  Other: 'badge-other',
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NoteCard({ note }: { note: Note }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${note.title}"?`)) return;
    setDeleting(true);
    const result = await deleteNote(note.id);
    if (result?.error) { alert(result.error); setDeleting(false); }
  }

  return (
    <div className={`card flex flex-col gap-4 p-5 transition-opacity group ${deleting ? 'opacity-40' : ''}`}
      style={{ transition: 'opacity 0.2s, border-color 0.2s' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>

      {/* Top row: category + date */}
      <div className="flex items-center justify-between gap-2">
        {note.category ? (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${BADGE_CLASS[note.category as Category]}`}>
            <Tag size={10} />
            {note.category}
          </span>
        ) : (
          <span />
        )}
        <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-3)' }}>
          <Calendar size={11} />
          {formatDate(note.activity_date)}
        </div>
      </div>

      {/* Title */}
      <Link href={`dashboard/detail/${note.id}`} className="flex-1">
        <h2 className="font-semibold text-base leading-snug line-clamp-2 mb-1.5" style={{ color: 'var(--text)' }}>
          {note.title}
        </h2>
        {note.description && (
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-3)' }}>
            {note.description}
          </p>
        )}
      </Link>
      {/* Actions */}
      <div className="flex items-center gap-1 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <Link href={`/dashboard/edit/${note.id}`}
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
