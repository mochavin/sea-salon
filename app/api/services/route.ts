import {
  getAllService,
  getServiceByBranch,
  postServices,
} from '@/drizzle/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = req;
    const res = await postServices(body);
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
  const searchParams = req.nextUrl.searchParams;
  const userIdQuery = searchParams.get('branchId');
  if (userIdQuery) {
    const branchId = parseInt(userIdQuery, 10);
    try {
      const res = await getServiceByBranch(branchId);
      return NextResponse.json(res);
    } catch (error) {
      console.error('Error fetching service by branch:', error);
      return NextResponse.json(
        { error: 'Failed to fetch service by branch' },
        { status: 500 }
      );
    }
  }
  try {
    const res = await getAllService();
    return NextResponse.json(res);
  } catch (error) {
    console.error('Error fetching service:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    );
  }
}
