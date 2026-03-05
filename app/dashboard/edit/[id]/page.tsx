// app/dashboard/edit/[id]/page.tsx
// In Next.js 15, `params` is a Promise and must be awaited before use.

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getNoteById } from '@/actions/noteActions';
import NoteForm from '@/components/NoteForm';
import { Category } from '@/lib/types';
import BackBtn from '@/components/BackBtn';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditNotePage({ params }: Props) {
  // Await params before accessing id
  const { id } = await params;

  const { note, error } = await getNoteById(id);
  if (error || !note) redirect('/dashboard');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <BackBtn href="/dashboard" label="Back to dashboard" />
        <h1 className="text-3xl" style={{ fontFamily: 'Instrument Serif, serif' }}>Edit Note</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Update your note details</p>
      </div>

      <NoteForm
        noteId={note.id}
        initialData={{
          title:         note.title,
          description:   note.description ?? '',
          activity_date: note.activity_date,
          categories: Array.isArray(note.categories)
              ? (note.categories as Category[])
              : [],
        }}
      />
    </div>
  );
}
