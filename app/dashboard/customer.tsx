import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { SelectReservation } from '@/drizzle/schema';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function CustomerDashboard() {
  const { data: session } = useSession();
  console.log('session', session);
  const { data: reservations, isFetching } = useQuery<SelectReservation[]>({
    queryKey: ['reservations'],
    queryFn: async () => {
      const response = await fetch(
        `/api/reservations/?email=${session?.user?.email}`
      );
      return response.json();
    },
    refetchOnWindowFocus: false,
  });
  const router = useRouter();
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>
        Welcome, {session?.user?.name}
      </h1>
      <h2 className='text-xl font-semibold mb-4'>Your Reservations</h2>
      <div className='flex flex-wrap -mx-2'>
        {isFetching ? (
          <>
            <div className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4'>
              <Card>
                <CardContent className='animate-pulse'>
                  <Skeleton className='h-16 bg-gray-200 rounded mb-2 mt-2'></Skeleton>
                  <Skeleton className='h-6 bg-gray-200 rounded'></Skeleton>
                </CardContent>
              </Card>
            </div>
            <div className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4'>
              <Card>
                <CardContent className='animate-pulse'>
                  <Skeleton className='h-16 bg-gray-200 rounded mb-2 mt-2'></Skeleton>
                  <Skeleton className='h-6 bg-gray-200 rounded'></Skeleton>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          reservations?.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))
        )}
      </div>
      <Button
        className='mt-4 w-full sm:w-auto'
        onClick={() => router.push('/dashboard/reservation')}
      >
        Make Reservation
      </Button>
    </div>
  );
}

const ReservationCard = ({
  reservation,
}: {
  reservation: SelectReservation;
}) => {
  const router = useRouter();
  const formatDate = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className='w-full sm:w-1/2 lg:w-1/3 p-2'>
      <Card>
        <CardContent>
          <div className='p-4 pb-0'>
            <h5 className='font-bold mb-2'>
              {formatDate(reservation.dateTime!).date}
            </h5>
            <p className='text-sm mb-2'>
              {formatDate(reservation.dateTime!).time}
            </p>
            <p className='mb-2'>Atas Nama: {reservation.name}</p>
            <p className='mb-2'>Phone: {reservation.phone}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
