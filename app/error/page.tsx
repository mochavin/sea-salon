'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React from 'react';

const ErrorPage: React.FC = () => {
  const router = useRouter();
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='mt-4 text-2xl font-bold text-gray-800'>
        Oops! Something went wrong.
      </h1>
      <p className='mt-2 text-gray-600'>We apologize for the inconvenience.</p>

      <Button onClick={() => router.back()} className='mt-4'>
        Go Back
      </Button>
    </div>
  );
};

export default ErrorPage;
