import { getAllService, postServices } from '@/drizzle/queries';
import { NextResponse } from 'next/server';

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

export async function GET(req: Request) {
  try {
    const res = await getAllService();
    return NextResponse.json(res);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
