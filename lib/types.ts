// lib/types.ts
export type Category = 'Work' | 'Study' | 'Meeting' | 'Other';

export interface Note {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  activity_date: string;
  categories: Category[];   // ← changed from single category to array
  created_at: string;
}

export type NoteFormData = {
  title: string;
  description: string;
  activity_date: string;
  categories: Category[];   // ← array now
};
