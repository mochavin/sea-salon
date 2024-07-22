import AddBranchForm from '@/components/add-branch.form';
import AddServiceForm from '@/components/add-service-form';
import { ServiceCard } from '@/components/service-card';
import { ServiceCardSkeleton } from '@/components/service-card-skeleton';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { SelectBranch, SelectReservation, SelectService } from '@/drizzle/schema';
import { fetchData } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useState } from 'react';

interface BranchData extends SelectBranch {
  serviceCount: number;
}

interface ReservationData extends SelectReservation {
  serviceName: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('reservations');

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

  const { data: reservations, isFetching: isFetchingReservations } = useQuery<
    ReservationData[]
  >({
    queryKey: ['reservations'],
    queryFn: () => fetchData('/api/all-reservations'),
    refetchOnWindowFocus: false,
  });

  const upComingReservations = reservations?.filter((reservation) => new Date(reservation.dateTime as string) > new Date());
  const pastReservations = reservations?.filter((reservation) => new Date(reservation.dateTime as string) < new Date());

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid w-full md:grid-cols-3 grid-cols-2 max-md:grid-rows-2 h-full'>
          <TabsTrigger value='reservations' className='w-full max-md:col-span-2 max-md:order-last'>Reservations</TabsTrigger>
          <TabsTrigger value='branches' className='w-full'>Branches</TabsTrigger>
          <TabsTrigger value='services' className='w-full'>Services</TabsTrigger>
        </TabsList>

        <TabsContent value='reservations' className='mt-8'>
          <div>
            {isFetchingReservations ? (
              Array(6)
                .fill(1)
                .map((_, index) => <ReservationCardSkeleton key={index} />)
            ) : reservations?.length! > 0 ? (
              <>
                <h1 className='text-lg font-semibold mb-3'>Upcoming Reservations</h1>
                <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4'>
                  {upComingReservations?.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
                <h1 className='text-lg font-semibold mb-3'>Past Reservations</h1>
                <div className='grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4'>
                  {pastReservations?.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))}
                </div>
              </>
            ) : (
              <p className='text-gray-500 col-span-full'>No reservations found</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value='branches' className='mt-8'>
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

        <TabsContent value='services' className='mt-8'>
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

const ReservationCardSkeleton = () => (
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

const ReservationCard = ({ reservation }: { reservation: ReservationData }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast({
        variant: 'default',
        title: 'Reservation deleted',
        description: 'The reservation has been removed from the list',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete reservation',
        description: 'Please try again',
      });
      console.error(error);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(reservation.id);
  };

  const isPast = new Date(reservation.dateTime as string) < new Date();

  return (
    <div className={`border border-gray-200 rounded-lg shadow-sm overflow-hidden ${isPast ? 'bg-gray-50' : 'bg-white'}`}>
      <div className='p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div className='overflow-hidden flex flex-col w-full'>
          <div className='flex items-center justify-between'>
            <p className='font-medium truncate'>{reservation.name}</p>
            <p className='text-sm text-gray-500'>{reservation.phone}</p>
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-xs text-gray-500'>
              {reservation.serviceName}
            </p>
            <p className='text-xs text-gray-500'>
              {new Date(reservation.dateTime as string).toLocaleDateString()} - {new Date(reservation.dateTime as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <div className='flex gap-2 sm:flex-col'>
          <Button
            size='sm'
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};