// app/dashboard/edit/[id]/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { getNoteById } from '@/actions/noteActions';
import NoteForm from '@/components/NoteForm';

type Props = { params: Promise<{ id: string }> };

export default async function EditNotePage({ params }: Props) {
  const { id } = await params;
const { note, error } = await getNoteById(id);
  if (error || !note) redirect('/dashboard');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm mb-4 transition-colors text-(--text-3) hover:text-foreground"
        >
          <ChevronLeft size={15} /> Back
        </Link>
        <h1 className="text-3xl" style={{ fontFamily: 'Instrument Serif, serif' }}>Edit Note</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Update your note details</p>
      </div>
      <NoteForm
        noteId={note.id}
        initialData={{
          title: note.title,
          description: note.description ?? '',
          activity_date: note.activity_date,
          category: (note.category as 'Work' | 'Study' | 'Meeting' | 'Other' | '') ?? '',
        }}
      />
    </div>
  );
}
