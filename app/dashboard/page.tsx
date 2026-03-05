// app/dashboard/page.tsx
import Link from 'next/link';
import { PenLine, StickyNote } from 'lucide-react';
import { getNotesPage } from '@/actions/noteActions';
import NoteCard from '@/components/NoteCard';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 9;

type SearchParams = Promise<{
  category?: string;
  date?: string;
  search?: string;
  page?: string;
}>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, date, search, page: pageStr } = await searchParams;

  const currentPage = Math.max(1, parseInt(pageStr ?? '1', 10));

  // Perbaikan: search bisa berupa string kosong dari URL
  // Kirim undefined jika search kosong agar tidak memfilter
  const searchValue = search?.trim() || undefined;

  const { notes, total, error } = await getNotesPage({
    category,
    date,
    search: searchValue, // Kirim undefined jika kosong
    page: currentPage,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);
  
  // Perbaikan: cek isFiltered dengan searchValue
  const isFiltered = (category && category !== 'all') || date || searchValue;

  const filterParts: string[] = [];
  if (category && category !== 'all') filterParts.push(category.split(',').join(' + '));
  if (date) filterParts.push(date);
  if (searchValue) filterParts.push(`"${searchValue}"`);

  return (
    <div>
      {/* Header - tetap sama */}
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl leading-tight" style={{ fontFamily: 'Instrument Serif, serif' }}>
            My Notes
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>
            {total} {total === 1 ? 'entry' : 'entries'}
            {filterParts.length > 0 && ` · ${filterParts.join(' · ')}`}
            {totalPages > 1 && ` · page ${currentPage} of ${totalPages}`}
          </p>
        </div>
        <Link href="/dashboard/new" className="btn-primary shrink-0">
          <PenLine size={15} />
          <span className="hidden sm:inline">New Note</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Filters - tetap kirim search apa adanya dari URL */}
      <FilterBar
        activeCategory={category ?? 'all'}
        activeDate={date ?? ''}
        activeSearch={search ?? ''} // Kirim string asli dari URL (bisa kosong)
      />

      {/* Error */}
      {error && (
        <div className="mt-2 p-4 rounded-xl text-sm"
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
            {isFiltered
              ? 'Try adjusting your filters or search term'
              : 'Create your first note to start tracking your day'}
          </p>
          {!isFiltered && (
            <Link href="/dashboard/new" className="btn-primary">
              <PenLine size={15} /> Create first note
            </Link>
          )}
        </div>
      )}

      {/* Notes grid */}
      {notes.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map(note => <NoteCard key={note.id} note={note} />)}
          </div>

          {/* Pagination */}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}