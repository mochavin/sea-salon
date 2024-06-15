import { db } from './db';
// import { InsertUser, usersTable } from './schema';

export async function createUser(data: any) {
  console.log('Creating user', data);
  // await db.insert(usersTable).values(data);
}
