'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SelectBranch } from '@/drizzle/schema';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function BranchPage() {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const { data: branch, isLoading } = useQuery<SelectBranch>({
    queryKey: ['branches', id],
    queryFn: async () => {
      const response = await fetch(`/api/branches/${id}`);
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
  const { toast } = useToast();

  const handleDelete = () => {
    console.log('Deleting branch', id);
    // TODO: Delete branch
    toast({
      variant: 'default',
      title: 'Branch deleted',
      description: 'The branch has been removed from the list',
    });
  };

  if (session?.user?.role !== 'Admin') {
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

  return (
    <div className='container flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Branch Dashboard</h1>
    </div>
  );
}
