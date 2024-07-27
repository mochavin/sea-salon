'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();
  return (
    <main className='min-h-screen bg-primary flex items-center justify-center'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-accent'>404</h1>
        <p className='text-xl text-accent mb-4'>Page Not Found</p>
        <Button
          onClick={() => {
            router.back();
          }}
          className='bg-accent text-primary hover:bg-accent/75'
        >
          Go back
        </Button>
      </div>
    </main>
  );
}
