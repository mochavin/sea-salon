'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Brush, Sparkles, Phone, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Header from '@/components/header';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  return (
    <div className='min-h-screen bg-secondary'>
      <section className='text-center mb-12 relative'>
        <div className='relative w-full h-64 rounded-lg shadow-lg mb-6 overflow-hidden'>
          <Image
            src='/assets/banner.png'
            alt='SEA Salon'
            layout='fill'
            objectFit='cover'
            className='rounded-lg'
          />
        </div>
        <div className='absolute inset-0 bg-primary/75 flex items-center justify-center'>
          <div>
            <h2 className='text-4xl font-bold text-secondary mb-4'>
              Beauty and Elegance Redefined
            </h2>
            <p className='text-xl text-secondary'>
              Welcome to SEA Salon, where we transform your look and boost your
              confidence.
            </p>
          </div>
        </div>
      </section>
      <main className='container mx-auto px-8 py-8 '>
        <section id='services' className='mb-12'>
          <h3 className='text-2xl font-semibold text-primary mb-6'>
            Our Services
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='bg-primary-foreground '>
              <CardHeader>
                <CardTitle className='flex items-center text-primary'>
                  <Scissors className='mr-2' />
                  Haircuts and Styling
                </CardTitle>
              </CardHeader>
              <CardContent className='text-primary'>
                <p>Professional cuts and styles for all hair types.</p>
              </CardContent>
            </Card>
            <Card className='bg-primary-foreground '>
              <CardHeader>
                <CardTitle className='flex items-center text-primary'>
                  <Brush className='mr-2' />
                  Manicure and Pedicure
                </CardTitle>
              </CardHeader>
              <CardContent className='text-primary'>
                <p>Pamper your hands and feet with our nail care services.</p>
              </CardContent>
            </Card>
            <Card className='bg-primary-foreground '>
              <CardHeader>
                <CardTitle className='flex items-center text-primary'>
                  <Sparkles className='mr-2' />
                  Facial Treatments
                </CardTitle>
              </CardHeader>
              <CardContent className='text-primary'>
                <p>
                  Rejuvenate your skin with our specialized facial treatments.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id='contact' className='mb-12'>
          <h3 className='text-2xl font-semibold text-primary mb-6'>
            Contact Us
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Card className='bg-primary-foreground'>
              <CardHeader>
                <CardTitle className='text-primary'>Thomas</CardTitle>
              </CardHeader>
              <CardContent className='text-primary'>
                <p className='flex items-center'>
                  <Phone className='mr-2' />
                  08123456789
                </p>
              </CardContent>
            </Card>
            <Card className='bg-primary-foreground'>
              <CardHeader>
                <CardTitle className='text-primary'>Sekar</CardTitle>
              </CardHeader>
              <CardContent className='text-primary'>
                <p className='flex items-center'>
                  <Phone className='mr-2' />
                  08164829372
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className='text-center'>
          <Button className='bg-primary hover:bg-primary/90 text-secondary'>
            <Link href='/dashboard/reservation'>Book an Appointment</Link>
          </Button>
        </div>
        <Reviews />
      </main>

      <footer className='bg-primary text-secondary py-4 mt-12'>
        <div className='container mx-auto px-4 text-center'>
          <p>&copy; 2024 SEA Salon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FormSchema = z.object({
  customerName: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  starRating: z
    .string()
    .refine((val) => ['1', '2', '3', '4', '5'].includes(val), {
      message: 'Please select a star rating.',
    }),
  comment: z.string().min(10, {
    message: 'Comment must be at least 10 characters.',
  }),
});

function Reviews() {
  const {
    data: reviews,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      const response = await fetch('/api/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      customerName: '',
      starRating: '',
      comment: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to submit reservation');
      }
      toast({
        title: 'Review submitted',
        description: 'Thank you for your feedback!',
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
    refetch();
    form.reset();
  }

  return (
    <section id='reviews' className='my-12'>
      <h3 className='text-2xl font-semibold text-primary mb-6'>
        Customer Reviews
      </h3>

      <Card className='bg-secondary mb-6'>
        <CardHeader>
          <CardTitle className='text-primary'>Leave a Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='customerName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-primary'>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Your name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='starRating'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-primary'>Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a rating' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Star{num !== 1 ? 's' : ''}
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
                name='comment'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-primary'>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Tell us about your experience'
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className={`bg-primary text-primary-foreground ${
                  isSubmitting ? 'cursor-not-allowed bg-secondary' : ''
                }`}
              >
                Submit Review
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {isFetching ? (
          <>
            <div className='w-full p-4 justify-between'>
              <Skeleton className='h-32 w-full bg-primary/30' />
            </div>
            <div className='w-full p-4 justify-between'>
              <Skeleton className='h-32 w-full bg-primary/30' />
            </div>
          </>
        ) : (
          reviews?.map((review: any, index: number) => (
            <Card key={index} className='bg-secondary'>
              <CardHeader>
                <CardTitle className='text-primary flex items-center justify-between'>
                  <span>{review.customerName}</span>
                  <span className='flex items-center'>
                    {[...Array(review.starRating)].map((_, i) => (
                      <Star
                        key={i}
                        className='w-5 h-5 fill-primary text-primary'
                      />
                    ))}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className='text-primary'>
                <p>{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}

export default HomePage;
