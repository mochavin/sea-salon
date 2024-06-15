import { createUser } from '@/drizzle/queries';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(request: Request) {
  await createUser({ name: 'John Doe', email: 'abc', age: 123 });

  return new Response('User created');
}
