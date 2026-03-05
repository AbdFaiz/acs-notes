'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { NoteFormData } from '@/lib/types';

async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/login');
  return { supabase, user };
}

// ─── CREATE ──────────────────────────────────────────────────
export async function createNote(formData: NoteFormData) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase.from('notes').insert({
    user_id:       user.id,
    title:         formData.title.trim(),
    description:   formData.description.trim() || null,
    activity_date: formData.activity_date,
    categories:    formData.categories,           // array
  });

  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// ─── READ ALL ─────────────────────────────────────────────────
export async function getNotes(filters?: {
  category?: string;   // single category filter from URL (comma-separated for multi)
  date?: string;
  search?: string;
}) {
  const { supabase, user } = await getAuthenticatedUser();

  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('activity_date', { ascending: false });

  // Filter by category — supports comma-separated multi: "Work,Study"
  if (filters?.category && filters.category !== 'all') {
    const cats = filters.category.split(',').filter(Boolean);
    if (cats.length === 1) {
      // Single: notes where categories array contains this value
      query = query.contains('categories', cats);
    } else {
      // Multiple: notes where categories array contains ANY of the selected
      query = query.overlaps('categories', cats);
    }
  }

  // Filter by date
  if (filters?.date) {
    query = query.eq('activity_date', filters.date);
  }

  const { data, error } = await query;
  if (error) return { notes: [], error: error.message };

  // Search by title (client-side after fetch — keeps query simple)
  let notes = data ?? [];
  if (filters?.search?.trim()) {
    const term = filters.search.trim().toLowerCase();
    notes = notes.filter(n => n.title.toLowerCase().includes(term));
  }

  return { notes, error: null };
}

// ─── READ ONE ─────────────────────────────────────────────────
export async function getNoteById(id: string) {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) return { note: null, error: error.message };
  return { note: data, error: null };
}

// ─── UPDATE ──────────────────────────────────────────────────
export async function updateNote(id: string, formData: NoteFormData) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from('notes')
    .update({
      title:         formData.title.trim(),
      description:   formData.description.trim() || null,
      activity_date: formData.activity_date,
      categories:    formData.categories,
    })
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// ─── DELETE ──────────────────────────────────────────────────
export async function deleteNote(id: string) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/dashboard');
  return { error: null };
}

// ─── AUTH ─────────────────────────────────────────────────────
export async function loginUser(email: string, password: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function registerUser(email: string, password: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { error: error.message };
  redirect('/login?message=Check your email to confirm your account');
}

export async function logoutUser() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function getNotesPage(filters?: {
  category?: string;
  date?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const { supabase, user } = await getAuthenticatedUser();

  const page     = filters?.page     ?? 1;
  const pageSize = filters?.pageSize ?? 9;
  const from     = (page - 1) * pageSize;
  const to       = from + pageSize - 1;

  // Buat query builder
  let query = supabase
    .from('notes')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('activity_date', { ascending: false });

  // Filter category (pake contains/overlaps)
  if (filters?.category && filters.category !== 'all') {
    const cats = filters.category.split(',').filter(Boolean);
    if (cats.length === 1) {
      query = query.contains('categories', cats);
    } else {
      query = query.overlaps('categories', cats);
    }
  }

  // Filter date
  if (filters?.date) {
    query = query.eq('activity_date', filters.date);
  }

  // FILTER SEARCH - pindah ke database query
  if (filters?.search?.trim()) {
    const searchTerm = filters.search.trim();
    // Gunakan ILIKE untuk case-insensitive search di title
    // Note: Supabase pake ilike (bukan contains)
    query = query.ilike('title', `%${searchTerm}%`);
    // Kalau mau search di description juga, tambah OR
    // query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  // Terapkan pagination SETELAH semua filter
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Supabase error:', error);
    return { notes: [], total: 0, error: error.message };
  }

  return { 
    notes: data ?? [], 
    total: count ?? 0, 
    error: null 
  };
}

