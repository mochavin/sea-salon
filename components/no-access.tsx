import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

export default function NoAccess() {
  const router = useRouter();
  return (
    <div className='container flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>
        You do not have access to this page
      </h1>
      <Button
        size='sm'
        variant='outline'
        onClick={() => router.push('/dashboard')}
      >
        Go to Dashboard
      </Button>
    </div>
  );
}
