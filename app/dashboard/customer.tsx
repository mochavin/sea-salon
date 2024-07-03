import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import {
  SelectBranch,
  SelectReservation,
  SelectService,
} from '@/drizzle/schema';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { fetchData } from '@/lib/utils';

interface ReservationData {
  reservations: SelectReservation;
  branches: SelectBranch;
  services: SelectService;
}

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const { data: reservations, isFetching } = useQuery<ReservationData[]>({
    queryKey: ['reservations'],
    queryFn: () => fetchData(`/api/reservations/`),
    refetchOnWindowFocus: false,
  });

  const currentDate = new Date();

  const pastReservations = reservations?.filter((reservation) => {
    const reservationDate = new Date(reservation.reservations.dateTime!);
    return reservationDate < currentDate;
  });

  const upcomingReservations = reservations?.filter((reservation) => {
    const reservationDate = new Date(reservation.reservations.dateTime!);
    return reservationDate > currentDate;
  });

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

const ReservationCard = ({ reservation }: { reservation: ReservationData }) => {
  return (
    <div className='w-full sm:w-1/2 lg:w-1/3 p-2'>
      <Card>
        <CardContent>
          <div className='p-4 pb-0 gap-2'>
            <div className='flex items-center justify-between'>
              <h5 className='font-bold mb-2'>
                {new Date(
                  reservation.reservations.dateTime!
                ).toLocaleDateString('id-ID', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </h5>
              <p className='text-sm mb-2'>
                {new Date(
                  reservation.reservations.dateTime!
                ).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className='flex flex-col mb-2 text-sm opacity-80'>
              <p className=''>Branch: {reservation.branches?.name}</p>
              <p className=''>Service: {reservation.services?.name}</p>
            </div>
            <div className='flex flex-col'>
              <p className=''>Atas Nama: {reservation.reservations.name}</p>
              <p className=''>Phone: {reservation.reservations.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const renderReservations = (
  reservationList: ReservationData[],
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
          <ReservationCard
            reservation={reservation}
            key={reservation.reservations.id}
          />
        ))
      )}
    </div>
  </>
);
