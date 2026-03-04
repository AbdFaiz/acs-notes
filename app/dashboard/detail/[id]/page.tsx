// app/dashboard/view/[id]/page.tsx
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft, Edit } from 'lucide-react';
import { getNoteById } from '@/actions/noteActions';
import NoteView from '@/components/NoteView';

type Props = { params: Promise<{ id: string }> };

export default async function ViewNotePage({ params }: Props) {
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
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl" style={{ fontFamily: 'Instrument Serif, serif' }}>Note Details</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>View your note information</p>
          </div>
          
          <Link 
            href={`/dashboard/edit/${note.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-(--accent-2) text-surface bg-accent"
          >
            <Edit size={15} />
            Edit Note
          </Link>
        </div>
      </div>

      <NoteView note={note} />
    </div>
  );
}