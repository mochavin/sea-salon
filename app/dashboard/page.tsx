'use client';
import { getSession, useSession } from 'next-auth/react';
import AdminDashboard from './admin';
import CustomerDashboard from './customer';
import Provider from '../Provider';

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
  });
  if (!session) {
    return null;
  }

  return (
    <div className='p-8'>
      {session?.user?.role === 'Admin' ? (
        <AdminDashboard />
      ) : (
        <CustomerDashboard />
      )}
    </div>
  );
}
