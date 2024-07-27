import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const formSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  openingTime: z
    .string()
    .regex(/^[0-9]{2}:[0-9]{2}$/, {
      message: 'Time must be in the format of HH:MM',
    })
    .transform((value) => value.split(':')),
  closingTime: z
    .string()
    .regex(/^[0-9]{2}:[0-9]{2}$/, {
      message: 'Time must be in the format of HH:MM',
    })
    .transform((value) => value.split(':')),
});

export default function AddBranchForm() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      location: '',
    },
  });

  const mutation = useMutation({
    mutationKey: ['addBranch'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['branches'],
      });
      form.reset();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values);
  };

  return (
    <div className='p-8 border-solid border border-gray-200 rounded-lg bg-secondary'>
      <h1 className='text-2xl font-bold mb-4'>Add Branch</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch Name</FormLabel>
                <FormControl>
                  <Input className="bg-primary" placeholder='Branch Name' {...field} />
                </FormControl>
                <FormMessage className='text-red-500' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='location'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input className="bg-primary" placeholder='Location' {...field} />
                </FormControl>
                <FormMessage className='text-red-500' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='openingTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Time</FormLabel>
                <FormControl>
                  <Input className="bg-primary" placeholder='08:00' {...field} />
                </FormControl>
                <FormMessage className='text-red-500' />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='closingTime'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Closing Time</FormLabel>
                <FormControl>
                  <Input className="bg-primary" placeholder='20:00' {...field} />
                </FormControl>
                <FormMessage className='text-red-500' />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={mutation.isPending} className='bg-accent text-primary hover:bg-accent/70'>
            {mutation.isPending ? 'Adding...' : 'Add Branch'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
