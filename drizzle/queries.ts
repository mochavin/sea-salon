import { db } from './db';
import { reservations } from './schema';
// import { InsertUser, usersTable } from './schema';

export async function createUser(data: any) {
  console.log('Creating user', data);
  // await db.insert(usersTable).values(data);
}

export async function postReservations(req: any) {
  try {
    const body = await req.json();
    console.log('Creating reservation', body);

    await db.insert(reservations).values(body);
    return { success: true };
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw new Error('Failed to create reservation');
  }
}
