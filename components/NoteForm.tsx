// components/NoteForm.tsx
'use client';

import { useState } from 'react';
import { Type, AlignLeft, Calendar, Tag, Save, X } from 'lucide-react';
import { createNote, updateNote } from '@/actions/noteActions';
import type { NoteFormData, Category } from '@/lib/types';

const CATEGORIES: Category[] = ['Work', 'Study', 'Meeting', 'Other'];

const CATEGORY_BADGE: Record<Category, string> = {
  Work: 'badge-work',
  Study: 'badge-study',
  Meeting: 'badge-meeting',
  Other: 'badge-other',
};

type Props = { noteId?: string; initialData?: NoteFormData };

export default function NoteForm({ noteId, initialData }: Props) {
  const isEditing = Boolean(noteId);
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<NoteFormData>({
    title:         initialData?.title         ?? '',
    description:   initialData?.description   ?? '',
    activity_date: initialData?.activity_date ?? today,
    category:      initialData?.category      ?? '',
  });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title.trim())    { setError('Title is required'); return; }
    if (!form.activity_date)   { setError('Date is required'); return; }
    setLoading(true);
    const result = isEditing ? await updateNote(noteId!, form) : await createNote(form);
    if (result?.error) { setError(result.error); setLoading(false); }
  }

  return (
    <div className="card p-6 sm:p-8">
      {error && (
        <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl text-sm"
          style={{ background: 'rgba(224,92,92,0.08)', border: '1px solid rgba(224,92,92,0.2)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Title */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-2 tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
            <Type size={12} /> Title <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input name="title" type="text" required
            placeholder="What did you do today?"
            value={form.title} onChange={handleChange}
            className="form-input text-base"
            style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.1rem' }}
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-2 tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
            <AlignLeft size={12} /> Notes
            <span className="normal-case font-normal ml-1" style={{ color: 'var(--text-3)' }}>(optional)</span>
          </label>
          <textarea name="description" rows={5}
            placeholder="Add more details, reflections, or anything else…"
            value={form.description} onChange={handleChange}
            className="form-input resize-none leading-relaxed"
          />
        </div>

        {/* Date + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2 tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
              <Calendar size={12} /> Date <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input name="activity_date" type="date" required
              value={form.activity_date} onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-2 tracking-wide uppercase" style={{ color: 'var(--text-3)' }}>
              <Tag size={12} /> Category
              <span className="normal-case font-normal" style={{ color: 'var(--text-3)' }}>(optional)</span>
            </label>
            <select name="category" value={form.category} onChange={handleChange} className="form-input">
              <option value="">No category</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        {/* Selected category preview */}
        {form.category && (
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: 'var(--text-3)' }}>Tagged as</span>
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium ${CATEGORY_BADGE[form.category as Category]}`}>
              <Tag size={9} />
              {form.category}
            </span>
          </div>
        )}

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)' }} />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            <Save size={15} />
            {loading ? (isEditing ? 'Saving…' : 'Creating…') : (isEditing ? 'Save changes' : 'Create note')}
          </button>
          <a href="/dashboard" className="btn-secondary">
            <X size={15} /> Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
