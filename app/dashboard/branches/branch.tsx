'use client';
import { useSearchParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SelectBranch, SelectService } from '@/drizzle/schema';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { ServiceCardSkeleton } from '@/components/service-card-skeleton';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NoAccess from '@/components/no-access';
import { ArrowLeftCircleIcon } from 'lucide-react';
import Link from 'next/link';

export default function BranchPage() {
  const { data: session } = useSession({
    required: true,
  });
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const { data: servicesData, isFetching: isFetchingServices } = useQuery<
    SelectService[]
  >({
    queryKey: ['branch', 'services', id],
    queryFn: async () => {
      const response = await fetch(`/api/services?branchId=${id}`);
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const { data: branchesData, isFetching: isFetchingBranches } =
    useQuery<SelectBranch>({
      queryKey: ['branches', id],
      queryFn: async () => {
        const response = await fetch(`/api/branches?branchId=${id}`);
        return response.json();
      },
      refetchOnWindowFocus: false,
    });

  if (session?.user?.role === 'Admin')
    return (
      <div className='container flex flex-col gap-4 py-8'>
        <Link href='/dashboard'>
          <ArrowLeftCircleIcon className='text-primary mb-4 mr-2' />
        </Link>
        <h1 className='text-2xl font-bold'>Branch Dashboard</h1>
        <AddServiceForm />
        <h2 className='text-lg font-semibold'>
          Services in Branch{' '}
          <span className='font-bold'>{branchesData?.name}</span>
        </h2>
        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
          {isFetchingServices ? (
            Array(6)
              .fill(1)
              .map((_, index) => <ServiceCardSkeleton key={index} />)
          ) : servicesData?.length! > 0 ? (
            servicesData?.map((service: SelectService) => (
              <ServiceCard key={service.id} service={service} />
            ))
          ) : (
            <p className='text-opacity-50'>No services found</p>
          )}
        </ul>
      </div>
    );
  else return <NoAccess />;
}

const formSchema = z.object({
  serviceId: z.string(),
});

const AddServiceForm = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();
  const { data: services } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await fetch('/api/services');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationKey: ['addService'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch('/api/branches/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          branchId: id,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['branch', 'services', id],
      });
      toast({
        variant: 'default',
        title: 'Service added',
        description: 'The service has been added to the list',
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Failed to add service',
        description: 'Service already exists',
      });
      console.error(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className='p-8 border-solid border border-gray-200 rounded-lg'>
      <h1 className='text-2xl font-bold mb-4'>Add Service</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='serviceId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a service' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {services?.map((service: SelectService) => (
                      <SelectItem
                        key={service.id}
                        value={service.id.toString()}
                      >
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={mutation.isPending}>
            {mutation.isPending ? 'Adding...' : 'Add Service'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

const ServiceCard = ({ service }: { service: SelectService }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id');

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(
        `/api/branches/services?branchId=${id}&serviceId=${service.id}`,
        {
          method: 'DELETE',
          body: JSON.stringify({
            branchId: id,
            serviceId: service.id,
          }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete service');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branch', 'services', id] });
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
    deleteMutation.mutate(parseInt(id!));
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
