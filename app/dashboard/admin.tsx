import AddBranchForm from '@/components/add-branch.form';
import AddServiceForm from '@/components/add-service-form';
import { ServiceCard } from '@/components/service-card';
import { ServiceCardSkeleton } from '@/components/service-card-skeleton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { SelectBranch, SelectService } from '@/drizzle/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { data: services, isFetching: isFetchingServices } = useQuery<
    SelectService[]
  >({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const { data: branches, isFetching: isFetchingBranches } = useQuery<
    SelectBranch[]
  >({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await fetch('/api/branches');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div className='container flex flex-col gap-4'>
      <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
      <AddServiceForm />
      <h2 className='text-lg font-semibold'>Current Services</h2>
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
        {isFetchingServices ? (
          Array(6)
            .fill(1)
            .map((_, index) => <ServiceCardSkeleton key={index} />)
        ) : services?.length! > 0 ? (
          services?.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))
        ) : (
          <p className='text-opacity-50'>No services found</p>
        )}
      </ul>
      <AddBranchForm />
      <h2 className='text-lg font-semibold'>Current Branches</h2>
      <ul className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
        {isFetchingBranches ? (
          Array(6)
            .fill(1)
            .map((_, index) => <BranchCardSkeleton key={index} />)
        ) : branches?.length! > 0 ? (
          branches?.map((branch) => (
            <BranchCard key={branch.id} branch={branch} />
          ))
        ) : (
          <p className='text-opacity-50'>No branches found</p>
        )}
      </ul>
    </div>
  );
}

const BranchCardSkeleton = () => (
  <li className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
    <div className='p-4 flex justify-between items-center'>
      <div className='overflow-hidden w-2/3'>
        <Skeleton className='h-5 w-full mb-2' />
        <Skeleton className='h-4 w-3/4' />
      </div>
      <Skeleton className='h-9 w-20' />
    </div>
  </li>
);

const BranchCard = ({ branch }: { branch: SelectBranch }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const { data: serviceCount, isFetching: isFetchingServiceCount } = useQuery({
    queryKey: ['serviceCount', branch.id],
    queryFn: async () => {
      const response = await fetch(`/api/branches/${branch.id}`);
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/branches/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete branch');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      toast({
        variant: 'default',
        title: 'Branch deleted',
        description: 'The branch has been removed from the list',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete branch',
        description: 'Please try again',
      });
      console.error(error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(branch.id);
    console.log('Deleted branch', branch.id);
  };

  const formatTime = (timeString: string) => {
    const matches = timeString.match(/\{"(\d{2})","(\d{2})"\}/);
    if (matches) {
      return `${matches[1]}:${matches[2]}`;
    }
    return 'Invalid time';
  };

  return (
    <li className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      <div className='p-4 flex justify-between items-center'>
        <div className='overflow-hidden flex flex-col w-full px-4'>
          <div className='flex items-center justify-between'>
            <p className='font-medium truncate'>{branch.name}</p>
            <p className='text-sm text-gray-500'>{branch.location}</p>
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-500'>{serviceCount} Services</p>
            <p className='text-sm text-gray-500'>
              {formatTime(branch.openingTime)} -{' '}
              {formatTime(branch.closingTime)}
            </p>
          </div>
        </div>
        <div className='flex gap-2 flex-col'>
          <Button
            size='sm'
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
          <Button size='sm' variant='outline'>
            <Link href={`/dashboard/branches?id=${branch.id}`}>Manage</Link>
          </Button>
        </div>
      </div>
    </li>
  );
};
