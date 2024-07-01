'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { signOut, useSession } from 'next-auth/react';
import { Skeleton } from './ui/skeleton';

export default function Header() {
  const { status } = useSession();
  return (
    <header className='bg-primary shadow-md'>
      <div className='container mx-auto px-4 py-6 flex justify-between items-center'>
        <Link href='/'>
          <h1 className='text-3xl font-bold text-secondary'>SEA Salon</h1>
        </Link>
        <nav>
          <ul className='flex space-x-4 items-center'>
            {status === 'authenticated' ? (
              <>
                <li className='text-white cursor-pointer'>
                  <Link href='/dashboard'>
                    <p>Dashboard</p>
                  </Link>
                </li>
                <li className='text-white cursor-pointer'>
                  <div onClick={() => signOut({ callbackUrl: '/' })}>
                    Log Out
                  </div>
                </li>
              </>
            ) : status === 'loading' ? (
              <li>
                <Skeleton className='w-16 h-8' />
              </li>
            ) : (
              <li>
                <Link href='/auth'>
                  <p className='text-secondary hover:text-white'>Sign In</p>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
