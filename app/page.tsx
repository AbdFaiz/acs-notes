// app/page.tsx
// Root page — just redirects users to the right place.
// Middleware handles the actual auth check.

import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dashboard');
}
