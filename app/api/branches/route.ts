import { getBranchById, getBranches, postBranches } from '@/drizzle/queries';
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
    const branchId = params.get('branchId');
    if (branchId) {
      const res = await getBranchById(branchId);
      console.log(res);
      return NextResponse.json(res);
    }
    const res = await getBranches();
    return NextResponse.json(res);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}
