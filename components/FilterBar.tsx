// components/FilterBar.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { X, Search } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

const CATEGORIES = ['Work', 'Study', 'Meeting', 'Other'];

const DOT_COLORS: Record<string, string> = {
  Work:    'var(--work)',
  Study:   'var(--study)',
  Meeting: 'var(--meeting)',
  Other:   'var(--other)',
};

type Props = {
  activeCategory: string;
  activeDate: string;
  activeSearch: string;
};

export default function FilterBar({ activeCategory, activeDate, activeSearch }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Local state untuk search input
  const [searchInput, setSearchInput] = useState(activeSearch);
  
  // Debounce search value
  const debouncedSearch = useDebounce(searchInput, 500); // 500ms delay

  const activeCats = activeCategory === 'all' || !activeCategory
    ? []
    : activeCategory.split(',').filter(Boolean);

  // Function to build URL and navigate
  const updateFilters = useCallback((newCats: string[], newDate: string, newSearch: string) => {
    const params = new URLSearchParams();
    if (newCats.length > 0) params.set('category', newCats.join(','));
    if (newDate) params.set('date', newDate);
    if (newSearch.trim()) params.set('search', newSearch.trim());
    
    const search = params.toString();
    router.push(`${pathname}${search ? '?' + search : ''}`, { scroll: false });
  }, [pathname, router]);

  // Effect untuk search dengan debounce
  useEffect(() => {
    updateFilters(activeCats, activeDate, debouncedSearch);
  }, [debouncedSearch]);

  function toggleCategory(cat: string) {
    const newCats = activeCats.includes(cat)
      ? activeCats.filter(c => c !== cat)
      : [...activeCats, cat];
    updateFilters(newCats, activeDate, searchInput);
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    updateFilters(activeCats, e.target.value, searchInput);
  }

  function clearAll() {
    setSearchInput(''); // Reset local search
    router.push(pathname);
  }

  const hasFilters = activeCats.length > 0 || activeDate || activeSearch.trim();

  return (
    <div className="flex items-center justify-between gap-3 mb-5">
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map(cat => {
          const isActive = activeCats.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: isActive ? 'var(--surface-2)' : 'var(--surface)',
                color: isActive ? 'var(--text)' : 'var(--text-3)',
                border: `1px solid ${isActive ? 'var(--border-2)' : 'var(--border)'}`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: DOT_COLORS[cat], opacity: isActive ? 1 : 0.4 }}
              />
              {cat}
            </button>
          );
        })}

        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-all text-(--text-3) hover:text-(--danger) border border-border bg-surface hover:border-(--danger)"
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search dengan local state */}
        <div className="relative w-48">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-3)' }}
          />
          
          <input
            type="text"
            placeholder="Search notes…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-full focus:outline-none transition-all"
            style={{
              background: searchInput ? 'var(--surface-2)' : 'var(--surface)',
              border: `1px solid ${searchInput ? 'var(--border-2)' : 'var(--border)'}`,
              color: 'var(--text)',
            }}
          />
        </div>

        {/* Date input */}
        <input
          type="date"
          value={activeDate}
          onChange={handleDateChange}
          className="text-xs px-3 py-1.5 rounded-full focus:outline-none transition-all"
          style={{
            background: activeDate ? 'var(--surface-2)' : 'var(--surface)',
            border: `1px solid ${activeDate ? 'var(--border-2)' : 'var(--border)'}`,
            color: activeDate ? 'var(--text)' : 'var(--text-3)',
          }}
        />
      </div>
    </div>
  );
}