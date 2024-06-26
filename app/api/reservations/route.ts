// app/api/reservations/route.ts
import { postReservations } from '@/drizzle/queries';
import { NextResponse } from 'next/server';

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
