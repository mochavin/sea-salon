import {
  getBranchById,
  getBranchIdByName,
  getBranchesWithServiceCount,
  postBranches,
} from '@/drizzle/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = req;
    const res = await postBranches(body);
    return NextResponse.json(res);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const branchIdParam = params.get('branchId');
    const branchNameParam = params.get('branchName');
    const branchId = branchIdParam
      ? parseInt(branchIdParam, 10)
      : branchNameParam
      ? await getBranchIdByName(branchNameParam)
      : undefined;
    if (branchId) {
      const res = await getBranchById(branchId);
      return NextResponse.json(res);
    }
    const res = await getBranchesWithServiceCount();
    return NextResponse.json(res);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}
