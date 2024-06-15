import { db } from '@/drizzle/db';
import { currentUser } from '@clerk/nextjs/server';
import { createUserMessage, deleteUserMessage } from './actions';

async function getUserMessage() {
  const user = await currentUser();
  if (!user) return null;
  // throw new Error('User not found');
  return db.query.UserMessages.findFirst({
    where: (messages, { eq }) => eq(messages.user_id, user.id),
  });
}

export default async function Home() {
  const existingMessage = await getUserMessage();

  return (
    <main className='flex flex-col items-center justify-center min-h-screen'>
      <h1 className='text-3xl font-bold mb-8'>Neon + Clerk Example</h1>
      {existingMessage ? (
        <div className='text-center'>
          <p className='text-xl mb-4'>{existingMessage.message}</p>
          <form action={deleteUserMessage}>
            <button
              type='submit'
              className='bg-red-500 text-white px-4 py-2 rounded'
            >
              Delete Message
            </button>
          </form>
        </div>
      ) : (
        <form action={createUserMessage} className='flex flex-col items-center'>
          <input
            type='text'
            name='message'
            placeholder='Enter a message'
            className='border border-gray-300 rounded px-4 py-2 mb-4 w-64'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Save Message
          </button>
        </form>
      )}
    </main>
  );
}
