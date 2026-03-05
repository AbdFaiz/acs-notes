// components/Pagination.tsx
// URL-based pagination — page number lives in ?page= query param.
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({ currentPage, totalPages }: Props) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete('page');
    else params.set('page', String(page));
    const search = params.toString();
    router.push(`${pathname}${search ? '?' + search : ''}`);
  }

  // Build page number list with ellipsis
  function getPages(): (number | '…')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '…')[] = [1];
    if (currentPage > 3)           pages.push('…');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);
    return pages;
  }

  const btnBase = 'w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all';

  return (
    <div className="flex items-center justify-center gap-1 mt-8">

      {/* Prev */}
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} disabled:opacity-30`}
        style={{ color: 'var(--text-2)', border: '1px solid var(--border)', background: 'var(--surface)' }}
        onMouseEnter={e => { if (currentPage > 1) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; }}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
      >
        <ChevronLeft size={15} />
      </button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-sm"
            style={{ color: 'var(--text-3)' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={btnBase}
            style={p === currentPage ? {
              background: 'var(--accent)',
              color: '#0f0f11',
              border: '1px solid var(--accent)',
              fontWeight: 600,
            } : {
              color: 'var(--text-2)',
              border: '1px solid var(--border)',
              background: 'var(--surface)',
            }}
            onMouseEnter={e => { if (p !== currentPage) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; }}
            onMouseLeave={e => { if (p !== currentPage) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} disabled:opacity-30`}
        style={{ color: 'var(--text-2)', border: '1px solid var(--border)', background: 'var(--surface)' }}
        onMouseEnter={e => { if (currentPage < totalPages) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-2)'; }}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}
