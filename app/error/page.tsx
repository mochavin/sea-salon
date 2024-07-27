'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

const ErrorPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-secondary'>
      <h1 className='mt-4 text-2xl font-bold text-accent'>
        Oops! Something went wrong.
      </h1>
      <p className='mt-2 text-accent'>
        Please try again later.
      </p>

      <Button onClick={() => router.back()} className='mt-4 bg-accent text-primary hover:bg-accent/70'>
        Go Back
      </Button>
    </div>
  );
};

export default ErrorPage;
