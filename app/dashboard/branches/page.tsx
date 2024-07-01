import Provider from '@/app/Provider';
import BranchPage from './branch';
import { Suspense } from 'react';

export default function branchPage() {
  return (
    <Suspense>
      <BranchPage />
    </Suspense>
  );
}
