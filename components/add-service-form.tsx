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
  duration: z.number().min(1),
});

export default function AddServiceForm() {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      duration: 30,
    },
  });

  const mutation = useMutation({
    mutationKey: ['addService'],
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await fetch('/api/services', {
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
        queryKey: ['services'],
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
      <h1 className='text-2xl font-bold mb-4'>Add Service</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input className='bg-primary' placeholder='Service Name' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='duration'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Duration'
                    className='bg-primary'
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={mutation.isPending} className='bg-accent text-primary hover:bg-accent/70'>
            {mutation.isPending ? 'Adding...' : 'Add Service'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
