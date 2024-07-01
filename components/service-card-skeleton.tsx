import { Skeleton } from './ui/skeleton';

export const ServiceCardSkeleton = () => (
  <li className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
    <div className='p-4 flex justify-between items-center'>
      <div className='overflow-hidden w-2/3'>
        <Skeleton className='h-5 w-full mb-2' />
        <Skeleton className='h-4 w-3/4' />
      </div>
      <Skeleton className='h-9 w-20' />
    </div>
  </li>
);
