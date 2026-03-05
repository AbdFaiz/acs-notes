import NoteForm from '@/components/NoteForm';
import BackBtn from '@/components/BackBtn';

export default function NewNotePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <BackBtn href="/dashboard" label="Back to dashboard" />
        <h1 className="text-3xl" style={{ fontFamily: 'Instrument Serif, serif' }}>New Note</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>Record what you accomplished today</p>
      </div>
      <NoteForm />
    </div>
  );
}
