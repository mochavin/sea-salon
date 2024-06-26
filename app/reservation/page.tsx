import ReservationForm from '@/components/reservation-form';

export default function Home() {
  return (
    <main className='min-h-screen bg-secondary p-24'>
      <div className='max-w-md mx-auto bg-secondary p-8 rounded-lg shadow-lg'>
        <h1 className='text-3xl font-bold mb-6 text-primary'>
          Make a Reservation
        </h1>
        <ReservationForm />
      </div>
    </main>
  );
}
