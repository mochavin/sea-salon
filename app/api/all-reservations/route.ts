
import { getAllReservations, getReservations, postReservations } from '@/drizzle/queries';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOption } from '@/lib/authOptions';

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
  try {
    const res = await getAllReservations();
    return NextResponse.json(res);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}
