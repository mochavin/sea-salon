'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className='bg-primary shadow-md'>
      <div className='container mx-auto px-4 py-6 flex justify-between items-center'>
        <Link href='/'>
          <h1 className='text-3xl font-bold text-secondary'>SEA Salon</h1>
        </Link>
        <nav>
          <ul className='flex space-x-4'>
            <li>
              <Link
                href='#services'
                className='text-secondary hover:text-white'
              >
                Services
              </Link>
            </li>
            <li>
              <Link href='#contact' className='text-secondary hover:text-white'>
                Contact
              </Link>
            </li>
            {session ? (
              <li>
                <Button onClick={() => signOut({ callbackUrl: '/' })}>
                  Log Out
                </Button>
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
