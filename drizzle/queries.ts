import { getSession } from 'next-auth/react';
import { db } from './db';
import {
  branches,
  branchesServices,
  reservations,
  reviews,
  services,
  users,
} from './schema';
import { getServerSession } from 'next-auth';
import { and, eq } from 'drizzle-orm';
// import { InsertUser, usersTable } from './schema';

export async function createUser(data: any) {
  console.log('Creating user', data);
  // await db.insert(usersTable).values(data);
}

export async function postReservations(req: any) {
  try {
    let body = await req.json();
    const session = await getServerSession();
    const user = await db.query.users.findFirst({
      where: eq(users.email, session?.user?.email!),
    });
    const serviceId = await db.query.services.findFirst({
      where: eq(services.name, body.service),
    });
    console.log('Creating reservation', serviceId, user, body);
    body = { ...body, serviceId: serviceId?.id, userId: user?.id };
    await db.insert(reservations).values(body);
    return { success: true };
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw new Error('Failed to create reservation');
  }
}

export async function getReservations(email: string) {
  const userId = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  return await db
    .select()
    .from(reservations)
    .where(eq(reservations.userId, userId?.id!));
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

export async function getAllService() {
  return await db.select().from(services);
}

export async function postServices(req: any) {
  try {
    const body = await req.json();
    await db.insert(services).values(body);
    return { success: true };
  } catch (error) {
    console.error('Error creating service:', error);
    throw new Error('Failed to create service');
  }
}

export async function getBranches() {
  return await db.select().from(branches);
}

export async function getBranchCount(req: any) {
  try {
    const res = await db
      .select()
      .from(branchesServices)
      .where(eq(branchesServices.branchId, req));
    return res.length;
  } catch (error) {
    console.error('Error getting branch count:', error);
    throw new Error('Failed to get branch count');
  }
}

export async function postBranches(req: any) {
  try {
    const body = await req.json();
    console.log('Creating branch', body);
    await db.insert(branches).values(body);
    return { success: true };
  } catch (error) {
    console.error('Error creating branch:', error);
    throw new Error('Failed to create branch');
  }
}
