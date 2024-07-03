import AddBranchForm from '@/components/add-branch.form';
import AddServiceForm from '@/components/add-service-form';
import { ServiceCard } from '@/components/service-card';
import { ServiceCardSkeleton } from '@/components/service-card-skeleton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { SelectBranch, SelectService } from '@/drizzle/schema';
import { fetchData } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

interface BranchData extends SelectBranch {
  serviceCount: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('branches');

  const { data: services, isFetching: isFetchingServices } = useQuery<
    SelectService[]
  >({
    queryKey: ['services'],
    queryFn: () => fetchData('/api/services'),
    refetchOnWindowFocus: false,
  });

  const { data: branches, isFetching: isFetchingBranches } = useQuery<
    BranchData[]
  >({
    queryKey: ['branches'],
    queryFn: () => fetchData('/api/branches'),
    refetchOnWindowFocus: false,
  });

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='branches'>Manage Branches</TabsTrigger>
          <TabsTrigger value='services'>Manage Services</TabsTrigger>
        </TabsList>

        <TabsContent value='branches' className='mt-6'>
          <div>
            <AddBranchForm />
            <h2 className='text-lg font-semibold'>Current Branches</h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {isFetchingBranches ? (
                Array(4)
                  .fill(1)
                  .map((_, index) => <BranchCardSkeleton key={index} />)
              ) : branches?.length! > 0 ? (
                branches?.map((branch) => (
                  <BranchCard key={branch.id} branch={branch} />
                ))
              ) : (
                <p className='text-gray-500 col-span-full'>No branches found</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value='services' className='mt-6'>
          <div>
            <AddServiceForm />
            <h2 className='text-lg font-semibold'>Current Services</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {isFetchingServices ? (
                Array(6)
                  .fill(1)
                  .map((_, index) => <ServiceCardSkeleton key={index} />)
              ) : services?.length! > 0 ? (
                services?.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))
              ) : (
                <p className='text-gray-500 col-span-full'>No services found</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const BranchCardSkeleton = () => (
  <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
    <div className='p-4 flex justify-between items-center'>
      <div className='overflow-hidden w-2/3'>
        <Skeleton className='h-5 w-full mb-2' />
        <Skeleton className='h-4 w-3/4' />
      </div>
      <Skeleton className='h-9 w-20' />
    </div>
  </div>
);

const BranchCard = ({ branch }: { branch: BranchData }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      <div className='p-4 flex justify-between items-center'>
        <div className='overflow-hidden flex flex-col w-full px-4'>
          <div className='flex items-center justify-between'>
            <p className='font-medium truncate'>{branch.name}</p>
            <p className='text-sm text-gray-500'>{branch.location}</p>
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-500'>
              {branch.serviceCount} Services
            </p>
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
          <Link href={`/dashboard/branches?id=${branch.id}`}>
            <Button size='sm' variant='outline'>
              Manage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
