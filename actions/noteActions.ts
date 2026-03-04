// actions/noteActions.ts
// Server Actions for CRUD operations on notes.
// These run on the SERVER — safe to call from any Client or Server Component.
// 'use server' at the top tells Next.js these are server-only functions.

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { NoteFormData } from '@/lib/types';

// ─── Helper: Get the authenticated user or throw ─────────────────────────────
async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login'); // Not logged in → send to login page
  }

  return { supabase, user };
}

// ─── CREATE a new note ────────────────────────────────────────────────────────
export async function createNote(formData: NoteFormData) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase.from('notes').insert({
    user_id: user.id,             // Always use server-side user id (not from form)
    title: formData.title.trim(),
    description: formData.description.trim() || null,
    activity_date: formData.activity_date,
    category: formData.category || null,
  });

  if (error) {
    return { error: error.message };
  }

  // Clear the cached dashboard data so it refreshes
  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// ─── READ all notes for the logged-in user ────────────────────────────────────
export async function getNotes(filters?: { category?: string; date?: string }) {
  const { supabase, user } = await getAuthenticatedUser();

  let query = supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('activity_date', { ascending: false });

  // Optional: filter by category
  if (filters?.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }

  // Optional: filter by date
  if (filters?.date) {
    query = query.eq('activity_date', filters.date);
  }

  const { data, error } = await query;

  if (error) {
    return { notes: [], error: error.message };
  }

  return { notes: data ?? [], error: null };
}

// ─── READ a single note by ID ─────────────────────────────────────────────────
export async function getNoteById(id: string) {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)   // RLS also enforces this, but explicit is clearer
    .single();

  if (error) {
    return { note: null, error: error.message };
  }

  return { note: data, error: null };
}

// ─── UPDATE an existing note ──────────────────────────────────────────────────
export async function updateNote(id: string, formData: NoteFormData) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from('notes')
    .update({
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      activity_date: formData.activity_date,
      category: formData.category || null,
    })
    .eq('id', id)
    .eq('user_id', user.id);   // Extra safety: only update own notes

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}

// ─── DELETE a note ────────────────────────────────────────────────────────────
export async function deleteNote(id: string) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);   // Only delete own notes

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { error: null };
}

// ─── AUTH: Login ──────────────────────────────────────────────────────────────
export async function loginUser(email: string, password: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

// ─── AUTH: Register ───────────────────────────────────────────────────────────
export async function registerUser(email: string, password: string) {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  // After signup, redirect to login (user may need to confirm email)
  redirect('/login?message=Check your email to confirm your account');
}

// ─── AUTH: Logout ─────────────────────────────────────────────────────────────
export async function logoutUser() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect('/login');
}
