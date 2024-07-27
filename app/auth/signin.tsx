'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const [isFailed, setIsFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/dashboard',
    });
    if (result?.error) {
      console.error(result.error);
    }
    if (!result?.ok) setIsFailed(true);
    else {
      toast({
        title: 'Signed in',
        description: 'Welcome back!',
      });
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-secondary'>
      <div className='w-full max-w-md p-8 space-y-3 rounded-xl bg-primary shadow-lg'>
        <h1 className='text-2xl font-bold text-center'>Sign In</h1>
        {isFailed && (
          <p className='text-red-500 text-center'>Invalid email or password</p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='Password' {...field} />
                  </FormControl>
                  <FormMessage className='text-red-500' />
                </FormItem>
              )}
            />
            <Link
              href='/auth/signup'
              className='py-2 text-accent hover:underline text-center'
            >
              Create an account
            </Link>
            <Button type='submit' className='w-full bg-accent text-primary hover:bg-accent/75'>
              {isLoading ? 'Loading...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
