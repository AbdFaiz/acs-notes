// app/dashboard/page.tsx
import Link from 'next/link';
import { PenLine, StickyNote } from 'lucide-react';
import { getNotes } from '@/actions/noteActions';
import NoteCard from '@/components/NoteCard';
import FilterBar from '@/components/FilterBar';

// In Next.js 15, searchParams is a Promise and must be awaited
type SearchParams = Promise<{ category?: string; date?: string }>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  // Await searchParams before accessing any properties
  const { category, date } = await searchParams;

  const { notes, error } = await getNotes({ category, date });

  const isFiltered = (category && category !== 'all') || date;

  return (
    <div>
      {/* Header */}
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl leading-tight" style={{ fontFamily: 'Instrument Serif, serif' }}>
            My Notes
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
            {notes.length} {notes.length === 1 ? 'entry' : 'entries'}
            {category && category !== 'all' && ` · ${category}`}
            {date && ` · ${date}`}
          </p>
        </div>
        <Link href="/dashboard/new" className="btn-primary shrink-0">
          <PenLine size={15} />
          <span className="hidden sm:inline">New Note</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Filters */}
      <FilterBar activeCategory={category ?? 'all'} activeDate={date ?? ''} />

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 rounded-xl text-sm"
          style={{ background: 'rgba(224,92,92,0.08)', border: '1px solid rgba(224,92,92,0.2)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!error && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
            style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
            <StickyNote size={24} style={{ color: 'var(--text-3)' }} />
          </div>
          <h2 className="text-xl mb-2" style={{ fontFamily: 'Instrument Serif, serif' }}>
            {isFiltered ? 'No notes found' : 'No notes yet'}
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-3)' }}>
            {isFiltered ? 'Try clearing your filters' : 'Create your first note to start tracking your day'}
          </p>
          {!isFiltered && (
            <Link href="/dashboard/new" className="btn-primary">
              <PenLine size={15} /> Create first note
            </Link>
          )}
        </div>
      )}

      {/* Grid */}
      {notes.length > 0 && (
        <div className="grid gap-4 mt-5 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => <NoteCard key={note.id} note={note} />)}
        </div>
      )}
    </div>
  );
}
