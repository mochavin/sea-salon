'use client';
import AdminDashboard from './admin';
import CustomerDashboard from './customer';

export default function Dashboard() {
  return (
    <div className='p-8'>
      <AdminDashboard />
      <CustomerDashboard />
    </div>
  );
}
