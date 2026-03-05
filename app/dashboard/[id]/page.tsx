// app/dashboard/[id]/page.tsx
// Note detail view — shows full title, description, categories, date.

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Pencil, Calendar, Tag, Clock } from 'lucide-react';
import { getNoteById } from '@/actions/noteActions';
import DeleteButton from '@/components/DeleteButton';
import type { Category } from '@/lib/types';
import BackBtn from '@/components/BackBtn';

type Props = { params: Promise<{ id: string }> };

const BADGE_CLASS: Record<Category, string> = {
  Work:    'badge-work',
  Study:   'badge-study',
  Meeting: 'badge-meeting',
  Other:   'badge-other',
};

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatCreatedAt(ts: string) {
  return new Date(ts).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function NoteDetailPage({ params }: Props) {
  const { id } = await params;
  const { note, error } = await getNoteById(id);
  if (error || !note) redirect('/dashboard');

  const categories: Category[] = Array.isArray(note.categories) ? note.categories : [];

  return (
    <div className="max-w-2xl mx-auto">

      {/* Back */}
      <BackBtn href="/dashboard" label="Back to dashboard" />

      <div className="card overflow-hidden">

        {/* Header band */}
        <div className="px-7 py-6" style={{ borderBottom: '1px solid var(--border)' }}>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <span key={cat}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${BADGE_CLASS[cat]}`}>
                  <Tag size={10} /> {cat}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl leading-tight mb-4" style={{ fontFamily: 'Instrument Serif, serif' }}>
            {note.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-3)' }}>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formatDate(note.activity_date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              Created {formatCreatedAt(note.created_at)}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {note.description ? (
            <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-2)' }}>
              {note.description}
            </p>
          ) : (
            <p className="text-sm italic" style={{ color: 'var(--text-3)' }}>
              No description provided.
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-7 py-4 flex items-center gap-3" style={{ borderTop: '1px solid var(--border)' }}>
          <Link href={`/dashboard/edit/${note.id}`} className="btn-primary">
            <Pencil size={14} /> Edit note
          </Link>
          <DeleteButton noteId={note.id} noteTitle={note.title} />
        </div>
      </div>
    </div>
  );
}
