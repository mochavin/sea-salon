'use client';
import ReservationForm from '@/components/reservation-form';
import { ArrowLeftCircleIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession({
    required: true,
  });
  if (!session) return null;
  return (
    <main className='min-h-screen bg-secondary p-8'>
      <Link
        href='/dashboard'
        className='text-primary text-center mb-6 underlin'
      >
        <ArrowLeftCircleIcon className='mr-2' />
      </Link>
      <div className='max-w-md mx-auto bg-secondary p-8 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-6 text-primary'>
          Make a Reservation
        </h1>
        <ReservationForm />
      </div>
    </main>
  );
}
