'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { signOut, useSession } from 'next-auth/react';
import { Skeleton } from './ui/skeleton';

export default function Header() {
  const { status } = useSession();
  return (
    <header className='bg-primary fixed top-0 left-0 right-0 z-50 shadow-md bg-opacity-5 backdrop-blur-sm'>
      <div className='container mx-auto px-8 py-4 flex justify-between items-center'>
        <Link href='/'>
          <span className='font-extrabold text-3xl italic bg-gradient-to-l from-accent to-accent/60 bg-clip-text text-transparent px-2 max-md:text-xl'>
            SEA Salon
          </span>
        </Link>
        <nav>
          <ul className='flex space-x-4 items-center'>
            {status === 'authenticated' ? (
              <>
                <li className='text-accent font-bold hover:scale-110 duration-300 hover:text-accent/70 cursor-pointer'>
                  <Link href='/dashboard'>
                    <p>Dashboard</p>
                  </Link>
                </li>
                <li className='text-red-500 font-bold hover:scale-110 duration-300 hover:text-red-500/70 cursor-pointer'>
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
                  <p className='text-accent hover:text-secondary-dark font-bold'>Sign In</p>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
