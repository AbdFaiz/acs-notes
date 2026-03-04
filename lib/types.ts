export type Category = 'Work' | 'Study' | 'Meeting' | 'Other';

// Matches the notes table in Supabase
export interface Note {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  activity_date: string;   // ISO date string: "YYYY-MM-DD"
  category: Category | null;
  created_at: string;      // ISO timestamp
}

// Used for creating or editing a note (no id/user_id/created_at needed from the form)
export type NoteFormData = {
  title: string;
  description: string;
  activity_date: string;
  category: Category | '';
};
