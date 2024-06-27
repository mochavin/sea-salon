'use client';
import { useSession } from 'next-auth/react';
import SignIn from './signin';

export default function AuthPage() {
  return <SignIn />;
}
