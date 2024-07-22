// app/api/reservations/[id]/route.ts
import { deleteReservationById } from "@/drizzle/queries";
import { NextResponse } from "next/server";


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    await deleteReservationById(id);
    return NextResponse.json('Successfully deleted reservation');
  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branch' },
      { status: 500 }
    );
  }
}