// components/NoteView.tsx
'use client';

import { Calendar, Tag, FileText, BookOpen } from 'lucide-react';
import type { Note } from '@/lib/types';

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

type Props = {
  note: Note;
};

export default function NoteView({ note }: Props) {
  return (
    <div className="space-y-6">
      {/* Main Note Card */}
      <div className="card p-6 sm:p-8">
        {/* Title Section */}
        <div className="mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-foreground/5 text-accent">
              <FileText size={20} />
            </div>
            <div className="flex-1">
              <h2 
                className="text-2xl sm:text-3xl font-medium leading-tight"
                style={{ fontFamily: 'Instrument Serif, serif' }}
              >
                {note.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Date */}
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <Calendar size={16} className="text-(--text-3)" />
            <span className="font-medium" style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.1rem' }}>
              {formatDate(note.activity_date)}
            </span>
          </div>

          {/* Category */}
          <div className="p-4 rounded-xl bg-surface border border-border flex items-center gap-3">
            <Tag size={16} className="text-(--text-3)" />
            {note.category ? (
              <span className="font-medium" style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.1rem' }}>
                {note.category}
              </span>
            ) : (
              <span className="text-sm text-(--text-3)">No category</span>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs mb-3 uppercase tracking-wide text-(--text-3)">
            <BookOpen size={12} /> Notes
          </div>
          
          {note.description ? (
            <div className="p-5 rounded-xl whitespace-pre-wrap leading-relaxed bg-surface border border-border min-h-[120px]">
              {note.description}
            </div>
          ) : (
            <div className="p-5 rounded-xl text-center italic bg-surface border border-border text-(--text-3)">
              No additional notes
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-border" />

        {/* Footer Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-(--text-3)">
          <div className="flex items-center gap-1.5">
            <span>ID:</span>
            <span className="font-mono opacity-75">{note.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}