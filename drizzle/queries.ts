import { db } from './db';
import { reservations, reviews, users } from './schema';
// import { InsertUser, usersTable } from './schema';

export async function createUser(data: any) {
  console.log('Creating user', data);
  // await db.insert(usersTable).values(data);
}

export async function postReservations(req: any) {
  try {
    const body = await req.json();
    await db.insert(reservations).values(body);
    return { success: true };
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw new Error('Failed to create reservation');
  }
}

export async function postReviews(req: any) {
  try {
    const body = await req.json();
    console.log('Creating review', body);
    await db.insert(reviews).values(body);
    return { success: true };
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Failed to create review');
  }
}

export async function getReviews() {
  return await db.select().from(reviews);
}

export async function signUp(data: any) {
  const body = data;
  try {
    await db.insert(users).values(body);
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}
