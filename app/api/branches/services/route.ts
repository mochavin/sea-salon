import { NextRequest, NextResponse } from 'next/server';

import { deleteBranchService, postBranchServices } from '@/drizzle/queries';

export async function POST(req: NextRequest) {
  try {
    await postBranchServices(await req.json());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating branch service:', error);
    throw new Error('Failed to creating branch service');
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const serviceId = searchParams.get('serviceId') as string;
    const branchId = searchParams.get('branchId') as string;
    const res = await deleteBranchService({
      serviceId,
      branchId,
    });
    return NextResponse.json(res);
  } catch (error) {
    console.error('Error deleting branch service:', error);
    return NextResponse.json(
      { error: 'Failed to deleting branch service' },
      { status: 500 }
    );
  }
}
