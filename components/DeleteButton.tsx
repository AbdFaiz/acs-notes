// components/DeleteButton.tsx
// Extracted delete button — used in NoteDetail page.
// 'use client' for confirm dialog + loading state.
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteNote } from '@/actions/noteActions';

type Props = { noteId: string; noteTitle: string };

export default function DeleteButton({ noteId, noteTitle }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${noteTitle}"? This cannot be undone.`)) return;
    setLoading(true);
    const result = await deleteNote(noteId);
    if (result?.error) {
      alert(result.error);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border border-red-600 bg-red-600/30 hover:bg-red-600/40 text-white"
    >
      <Trash2 size={14} />
      {loading ? 'Deleting…' : 'Delete'}
    </button>
  );
}
