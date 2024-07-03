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
import { and, eq, sql } from 'drizzle-orm';
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
    const branchId = await db.query.branches.findFirst({
      where: eq(branches.name, body.branch),
    });
    body = {
      ...body,
      serviceId: serviceId?.id,
      userId: user?.id,
      branchId: branchId?.id,
    };
    console.log('Creating reservation', serviceId, user, body);
    await db.insert(reservations).values(body);
    return { success: true };
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw new Error('Failed to create reservation');
  }
}

export async function getReservations(userId: number) {
  return await db
    .select()
    .from(reservations)
    .innerJoin(branches, eq(reservations.branchId, branches.id))
    .innerJoin(services, eq(reservations.serviceId, services.id))
    .where(eq(reservations.userId, userId));
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

export async function getBranchesWithServiceCount() {
  return await db
    .select({
      id: branches.id,
      name: branches.name,
      location: branches.location,
      openingTime: branches.openingTime,
      closingTime: branches.closingTime,
      serviceCount: sql<number>`count(${branchesServices.serviceId})`.as(
        'serviceCount'
      ),
    })
    .from(branches)
    .leftJoin(
      branchesServices,
      sql`${branches.id} = ${branchesServices.branchId}`
    )
    .groupBy(branches.id)
    .orderBy(branches.id);
}
export async function getBranchById(req: any) {
  try {
    const res = await db.select().from(branches).where(eq(branches.id, req));
    return res[0];
  } catch (error) {
    console.error('Error getting branch by id:', error);
    throw new Error('Failed to get branch by id');
  }
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

export async function getServiceByBranch(req: any) {
  try {
    const res = await db
      .select()
      .from(services)
      .innerJoin(
        branchesServices,
        and(
          eq(services.id, branchesServices.serviceId),
          eq(branchesServices.branchId, req)
        )
      );

    const servicesOnly = res.map((item: any) => item.services);
    return servicesOnly;
  } catch (error) {
    console.error('Error getting service by branch:', error);
    throw new Error('Failed to get service by branch');
  }
}

export async function getBranchIdByName(name: string) {
  const res = await db.select().from(branches).where(eq(branches.name, name));
  return res[0].id;
}

export async function postBranches(req: any) {
  try {
    const body = await req.json();
    await db.insert(branches).values(body);
    return { success: true };
  } catch (error) {
    console.error('Error creating branch:', error);
    throw new Error('Failed to create branch');
  }
}

export async function postBranchServices(req: any) {
  try {
    console.log('Creating branch service', req);
    const isExist = await db
      .select()
      .from(branchesServices)
      .where(
        and(
          eq(branchesServices.branchId, req.branchId),
          eq(branchesServices.serviceId, req.serviceId)
        )
      );
    if (isExist.length > 0) {
      throw new Error('Branch service already exists');
    }
    await db.insert(branchesServices).values(req);
    return { success: true };
  } catch (error) {
    console.error('Error creating branch service:', error);
    throw new Error('Failed to create branch service');
  }
}

export async function deleteBranchService({
  serviceId,
  branchId,
}: {
  serviceId: string;
  branchId: string;
}) {
  try {
    const res = await db
      .delete(branchesServices)
      .where(
        and(
          eq(branchesServices.branchId, parseInt(branchId)),
          eq(branchesServices.serviceId, parseInt(serviceId))
        )
      );
    return { success: true };
  } catch (error) {
    console.error('Error deleting branch service:', error);
    throw new Error('Failed to delete branch service');
  }
}
