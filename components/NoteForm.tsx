// components/NoteForm.tsx
'use client';

import { useState } from 'react';
import { Type, AlignLeft, Calendar, Tag, Save, X, Check } from 'lucide-react';
import { createNote, updateNote } from '@/actions/noteActions';
import type { NoteFormData, Category } from '@/lib/types';

const CATEGORIES: Category[] = ['Work', 'Study', 'Meeting', 'Other'];

const CATEGORY_STYLES: Record<Category, { badge: string; dot: string }> = {
  Work:    { badge: 'badge-work',    dot: 'var(--work)'    },
  Study:   { badge: 'badge-study',   dot: 'var(--study)'   },
  Meeting: { badge: 'badge-meeting', dot: 'var(--meeting)' },
  Other:   { badge: 'badge-other',   dot: 'var(--other)'   },
};

type Props = { noteId?: string; initialData?: NoteFormData };

export default function NoteForm({ noteId, initialData }: Props) {
  const isEditing = Boolean(noteId);
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<NoteFormData>({
    title:         initialData?.title         ?? '',
    description:   initialData?.description   ?? '',
    activity_date: initialData?.activity_date ?? today,
    categories:    initialData?.categories    ?? [],
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Toggle a category in/out of the selected array
  function toggleCategory(cat: Category) {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title.trim())  { setError('Title is required'); return; }
    if (!form.activity_date) { setError('Date is required'); return; }
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
          <label className="flex items-center gap-2 text-xs font-medium mb-2 tracking-wide uppercase"
            style={{ color: 'var(--text-3)' }}>
            <Type size={12} /> Title <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input name="title" type="text" required
            placeholder="What did you do today?"
            value={form.title} onChange={handleChange}
            className="form-input"
            style={{ fontFamily: 'Instrument Serif, serif', fontSize: '1.1rem' }}
          />
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-2 tracking-wide uppercase"
            style={{ color: 'var(--text-3)' }}>
            <AlignLeft size={12} /> Notes
            <span className="normal-case font-normal ml-1" style={{ color: 'var(--text-3)' }}>(optional)</span>
          </label>
          <textarea name="description" rows={5}
            placeholder="Add more details, reflections, or anything else…"
            value={form.description} onChange={handleChange}
            className="form-input resize-none leading-relaxed"
          />
        </div>

        {/* Date */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-2 tracking-wide uppercase"
            style={{ color: 'var(--text-3)' }}>
            <Calendar size={12} /> Date <span style={{ color: 'var(--danger)' }}>*</span>
          </label>
          <input name="activity_date" type="date" required
            value={form.activity_date} onChange={handleChange}
            className="form-input"
          />
        </div>

        {/* Categories — multi-select toggle buttons */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium mb-3 tracking-wide uppercase"
            style={{ color: 'var(--text-3)' }}>
            <Tag size={12} /> Categories
            <span className="normal-case font-normal ml-1" style={{ color: 'var(--text-3)' }}>
              (optional, select multiple)
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const selected = form.categories.includes(cat);
              const { badge, dot } = CATEGORY_STYLES[cat];
              return (
                <button
                  key={cat}
                  type="button"               // prevent form submit
                  onClick={() => toggleCategory(cat)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium
                    transition-all border ${selected ? badge : ''}`}
                  style={!selected ? {
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-3)',
                  } : undefined}
                >
                  {/* Dot or checkmark */}
                  <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: selected ? dot : 'var(--border-2)',
                      border: selected ? 'none' : '1px solid var(--border-2)',
                    }}>
                    {selected && <Check size={9} color="#0f0f11" strokeWidth={3} />}
                  </span>
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Selected preview */}
          {form.categories.length > 0 && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-3)' }}>
              Selected: {form.categories.join(', ')}
            </p>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border)' }} />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            <Save size={15} />
            {loading
              ? (isEditing ? 'Saving…' : 'Creating…')
              : (isEditing ? 'Save changes' : 'Create note')}
          </button>
          <a href="/dashboard" className="btn-secondary">
            <X size={15} /> Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
