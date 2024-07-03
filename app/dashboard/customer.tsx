import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { SelectBranch, SelectReservation } from '@/drizzle/schema';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { fetchData } from '@/lib/utils';

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const { data: reservations, isFetching } = useQuery<SelectReservation[]>({
    queryKey: ['reservations'],
    queryFn: () =>
      fetchData(`/api/reservations/?email=${session?.user?.email}`),
    refetchOnWindowFocus: false,
  });

  const currentDate = new Date();

  const pastReservations = reservations?.filter((reservation) => {
    const reservationDate = new Date(reservation.dateTime!);
    return reservationDate < currentDate;
  });

  const upcomingReservations = reservations?.filter((reservation) => {
    const reservationDate = new Date(reservation.dateTime!);
    return reservationDate > currentDate;
  });
  console.log(reservations);
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>
        Welcome, {session?.user?.name}
      </h1>

      {isFetching ? (
        <div className='flex flex-wrap -mx-2'>
          {[...Array(2)].map((_, index) => (
            <div key={index} className='w-full sm:w-1/2 lg:w-1/3 px-2 mb-4'>
              <Card>
                <CardContent className='animate-pulse'>
                  <Skeleton className='h-16 bg-gray-200 rounded mb-2 mt-2'></Skeleton>
                  <Skeleton className='h-6 bg-gray-200 rounded'></Skeleton>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <>
          {renderReservations(upcomingReservations!, 'Upcoming Reservations')}
          {renderReservations(pastReservations!, 'Past Reservations')}
        </>
      )}

      <Button className='mt-4 w-full sm:w-auto'>
        <Link href='/dashboard/reservation'>Make Reservation</Link>
      </Button>
    </div>
  );
}

const ReservationCard = ({
  reservation,
}: {
  reservation: SelectReservation;
}) => {
  const { data: branches } = useQuery<SelectBranch>({
    queryKey: ['branches', reservation.branchId],
    queryFn: () => fetchData(`/api/branches?branchId=${reservation.branchId}`),
    refetchOnWindowFocus: false,
  });

  const { data: services } = useQuery<SelectBranch>({
    queryKey: ['services', reservation.branchId],
    queryFn: () => fetchData(`/api/services/${reservation.serviceId}`),
    refetchOnWindowFocus: false,
  });

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
          <div className='p-4 pb-0 gap-2'>
            <div className='flex items-center justify-between'>
              <h5 className='font-bold mb-2'>
                {formatDate(reservation.dateTime!).date}
              </h5>
              <p className='text-sm mb-2'>
                {formatDate(reservation.dateTime!).time}
              </p>
            </div>
            <div className='flex flex-col mb-2 text-sm opacity-80'>
              <p className=''>Branch: {branches?.name}</p>
              <p className=''>Service: {services?.name}</p>
            </div>
            <div className='flex flex-col'>
              <p className=''>Atas Nama: {reservation.name}</p>
              <p className=''>Phone: {reservation.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const renderReservations = (
  reservationList: SelectReservation[],
  title: string
) => (
  <>
    <h2 className='text-xl font-semibold mb-4'>{title}</h2>
    <div className='flex flex-wrap -mx-2 mb-8'>
      {reservationList.length === 0 ? (
        <div className='w-full px-2'>
          <p className='text-gray-500 text-center'>
            No {title.toLowerCase()} found
          </p>
        </div>
      ) : (
        reservationList.map((reservation) => (
          <ReservationCard reservation={reservation} key={reservation.id} />
        ))
      )}
    </div>
  </>
);
