import { authOption } from '@/lib/authOptions';
import NextAuth, { NextAuthOptions } from 'next-auth';

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };
