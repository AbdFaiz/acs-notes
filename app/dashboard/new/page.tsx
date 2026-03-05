// app/dashboard/new/page.tsx
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import NoteForm from '@/components/NoteForm';

export default function NewNotePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <Link href="/dashboard"
        className="inline-flex items-center gap-1 text-sm mb-6 transition-colors text-(--text-3) hover:text-text">
        <ChevronLeft size={15} /> Back to dashboard
      </Link>
        <h1 className="text-3xl" style={{ fontFamily: 'Instrument Serif, serif' }}>New Note</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Record what you accomplished today</p>
      </div>
      <NoteForm />
    </div>
  );
}
