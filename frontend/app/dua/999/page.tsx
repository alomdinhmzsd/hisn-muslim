// app/dua/999/page.tsx - REDIRECT TO MERITS
import { redirect } from 'next/navigation';

export default function MeritsRedirect() {
  redirect('/dua/merits');
  return null;
}