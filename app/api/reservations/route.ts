// app/api/reservations/route.ts
import { getReservations, postReservations } from '@/drizzle/queries';
import { NextRequest, NextResponse } from 'next/server';
import { authOption } from '../auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export async function POST(req: Request) {
  try {
    const body = req;
    const res = await postReservations(body);
    return NextResponse.json(res);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOption);
  const userId = parseInt(session?.user?.id!);
  try {
    const res = await getReservations(userId);
    return NextResponse.json(res);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}
