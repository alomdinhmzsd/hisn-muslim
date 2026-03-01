// app/dua/0/page.tsx - REDIRECT TO INTRODUCTION
import { redirect } from 'next/navigation';

export default function IntroductionRedirect() {
  redirect('/dua/introduction');
  return null;
}