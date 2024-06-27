import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { SelectReservation } from '@/drizzle/schema';

export default function CustomerDashboard() {
  const { data: session } = useSession();
  const { data: reservations } = useQuery<SelectReservation[]>({
    queryKey: ['reservations'],
    queryFn: async () => {
      const response = await fetch('/api/reservations');
      return response.json();
    },
  });

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>
        Welcome, {session?.user?.fullName}
      </h1>
      <h2 className='text-xl font-semibold mb-2'>Your Reservations</h2>
      {reservations &&
        reservations.map((reservation) => (
          <div key={reservation.id} className='mb-2 p-2 border rounded'>
            <p>Time: {reservation.dateTime}</p>
          </div>
        ))}
    </div>
  );
}
