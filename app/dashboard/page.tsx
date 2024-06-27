'use client';
import { useSession } from 'next-auth/react';
import AdminDashboard from './admin';
import CustomerDashboard from './customer';

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <div className='p-8'>
      <AdminDashboard />
      <CustomerDashboard />
    </div>
  );
}
