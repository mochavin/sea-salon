'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from './ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SelectBranch } from '@/drizzle/schema';
import { extractHourMinute } from '@/lib/utils';

const formSchema = z.object({
  branch: z.string().min(1, { message: 'Branch is required' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().regex(/^\d{10,}$/, {
    message: 'Phone number must be at least 10 digits.',
  }),
  service: z.string().min(1, { message: 'Service is required' }),
  dateTime: z.string().min(1, { message: 'Date and time is required' }),
});

export default function ReservationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branch: '',
      name: '',
      phone: '',
      service: '',
      dateTime: '',
    },
  });

  const branchName = form.watch('branch');

  const { data: branches } = useQuery({
    queryKey: ['branches'],
    queryFn: async () => {
      const response = await fetch('/api/branches');
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const { data: services } = useQuery({
    queryKey: ['services', branchName],
    queryFn: async () => {
      const response = await fetch('/api/services?branchName=' + branchName);
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  const { data: branchData } = useQuery<SelectBranch>({
    queryKey: ['branchesData', branchName],
    queryFn: async () => {
      const response = await fetch('/api/branches?branchName=' + branchName);
      return response.json();
    },
    refetchOnWindowFocus: false,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const openingTime = extractHourMinute(branchData?.openingTime!);
    const closingTime = extractHourMinute(branchData?.closingTime!);
    const dateTime = new Date(values.dateTime);
    if (dateTime < new Date()) {
      setIsSubmitting(false);
      return form.setError('dateTime', {
        type: 'manual',
        message: 'Date and time must be in the future',
      });
    }

    const hourInput = dateTime.getHours();
    const minuteInput = dateTime.getMinutes();

    if (
      hourInput < parseInt(openingTime?.hour!) ||
      hourInput > parseInt(closingTime?.hour!) ||
      (hourInput === parseInt(openingTime?.hour!) &&
        minuteInput < parseInt(openingTime?.minute!)) ||
      (hourInput === parseInt(closingTime?.hour!) &&
        minuteInput > parseInt(closingTime?.minute!))
    ) {
      setIsSubmitting(false);
      return form.setError('dateTime', {
        type: 'manual',
        message: `Time must be between ${openingTime?.hour}:${openingTime?.minute} and ${closingTime?.hour}:${closingTime?.minute}`,
      });
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error('Failed to submit reservation');
      }
      toast({
        variant: 'default',
        title: 'Reservation submitted',
        description: 'We will contact you shortly to confirm.',
      });
      form.reset();
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='branch'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a branch' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {branches?.map((branch: SelectBranch) => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder='085123456789' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='service'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a service' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services?.map((service: any) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dateTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date and Time</FormLabel>
              <FormControl>
                <Input type='datetime-local' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={isSubmitting}
          className='bg-primary text-primary-foreground'
        >
          {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
        </Button>
      </form>
    </Form>
  );
}
