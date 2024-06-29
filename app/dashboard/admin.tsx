import AddServiceForm from '@/components/add-service-form';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { SelectService } from '@/drizzle/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function AdminDashboard() {
  const { data: services, isFetching } = useQuery<SelectService[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
  return (
    <div className='container'>
      <h1 className='text-2xl font-bold'>Admin Dashboard</h1>
      <h2 className='text-lg font-semibold'>Current Services</h2>
      <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
        {isFetching
          ? Array(6)
              .fill(1)
              .map((_, index) => <ServiceCardSkeleton key={index} />)
          : services?.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
      </ul>
      <AddServiceForm />
    </div>
  );
}

const ServiceCardSkeleton = () => (
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

const ServiceCard = ({ service }: { service: SelectService }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      toast({
        variant: 'default',
        title: 'Service deleted',
        description: 'The service has been removed from the list',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete service',
        description: 'Please try again',
      });
      console.error(error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(service.id);
  };

  return (
    <li className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
      <div className='p-4 flex justify-between items-center'>
        <div className='overflow-hidden'>
          <p className='font-medium truncate'>{service.name}</p>
          <p className='text-sm text-gray-500'>{service.duration} minutes</p>
        </div>
        <Button
          size='sm'
          variant='destructive'
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </li>
  );
};
