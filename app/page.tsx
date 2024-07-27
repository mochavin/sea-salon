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
import { fetchData } from '@/lib/utils';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HomePage = () => {
  useEffect(() => {
    AOS.init({duration: 1200,});
  }, []);

  return (
    <div className='min-h-screen bg-primary'>
      <section className='text-center mb-12 relative'>
        <div className='relative w-full h-96 rounded-lg shadow-lg mb-6 overflow-hidden'>
          <Image
            src='/assets/banner.png'
            alt='SEA Salon'
            layout='fill'
            objectFit='cover'
            className='rounded-lg'
          />
        </div>
        <div className='absolute inset-0 bg-primary/60 flex items-center justify-center'>
          <div className='px-4'>
            <h2 className='text-5xl font-extrabold text-accent mb-4 tracking-wide' data-aos="zoom-out">
              <span className='bg-gradient-to-bl from-pink-700 to-purple-700 bg-clip-text text-transparent'>
                Beauty{' '}
              </span>
              and{' '}
              <span className='italic bg-gradient-to-l from-accent to-accent/60 bg-clip-text text-transparent'>
                Elegance{' '}
              </span>
              Redefined
            </h2>
            <p className='text-xl text-accent font-semibold'>
              Welcome to{' '}
              <span className='font-extrabold text-3xl italic bg-gradient-to-l from-accent to-accent/60 bg-clip-text text-transparent'>
                SEA Salon{' '}
              </span>
              , where
              we{' '}
              <span className='font-medium'>transform your look</span>{' '}
              and{' '}
              <span className='font-medium'>
                boost your confidence
              </span>
              .
            </p>
          </div>
        </div>
      </section>
      <main className='mx-auto py-8'>
        <section id='services' className='mb-12 container'>
          <h3 className='text-2xl font-semibold text-accent mb-6'>
            Our Services
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Card className='bg-secondary hover:bg-accent/20 transition-all duration-100 hover:-translate-y-1 hover:scale-[1.01]'>
              <CardHeader>
                <CardTitle className='flex items-center text-accent'>
                  <Scissors className='mr-2' />
                  <span className='bg-gradient-to-bl from-red-700 to-black py-1 bg-clip-text text-transparent'>Haircuts and Styling</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='text-accent'>
                <p>Professional cuts and styles for all hair types.</p>
              </CardContent>
            </Card>
            <Card className='bg-secondary hover:bg-accent/20 transition-all duration-100 hover:-translate-y-1 hover:scale-[1.01]'>
              <CardHeader>
                <CardTitle className='flex items-center text-accent'>
                  <Brush className='mr-2' />
                  <span className='bg-gradient-to-bl from-blue-700 to-black py-1 bg-clip-text text-transparent'>Manicure and Pedicure</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='text-accent'>
                <p>Pamper your hands and feet with our nail care services.</p>
              </CardContent>
            </Card>
            <Card className='bg-secondary hover:bg-accent/20 transition-all duration-100 hover:-translate-y-1 hover:scale-[1.01]'>
              <CardHeader>
                <CardTitle className='flex items-center text-accent'>
                  <Sparkles className='mr-2' />
                  <span className='bg-gradient-to-bl from-blue-700 to-purple-700 py-1 bg-clip-text text-transparent'>Facial Treatments</span>
                </CardTitle>
              </CardHeader>
              <CardContent className='text-accent'>
                <p>
                  Rejuvenate your skin with our specialized facial treatments.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className='text-center my-16'>
          <Button className='bg-accent hover:bg-accent/75 text-primary transition-all hover:scale-105 duration-300'>
            <Link href='/dashboard/reservation'>Book an Appointment</Link>
          </Button>
        </div>

        <section id='contact' className='mb-12 bg-accent text-primary'>
          <div className='container mx-auto px-4 py-16'>
            <h3 className='text-2xl font-semibold mb-6'>
              Contact Us
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card className='bg-secondary hover:bg-primary transition-all duration-100 hover:-translate-y-1 hover:scale-[1.01]' data-aos="flip-left">
                <CardHeader>
                  <CardTitle className='text-accent'>Thomas</CardTitle>
                </CardHeader>
                <CardContent className='text-accent'>
                  <p className='flex items-center'>
                    <Phone className='mr-2' />
                    08123456789
                  </p>
                </CardContent>
              </Card>
              <Card className='bg-secondary hover:bg-primary transition-all duration-100 hover:-translate-y-1 hover:scale-[1.01]' data-aos="flip-left">
                <CardHeader>
                  <CardTitle className='text-accent'>Sekar</CardTitle>
                </CardHeader>
                <CardContent className='text-accent'>
                  <p className='flex items-center'>
                    <Phone className='mr-2' />
                    08164829372
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>


        <Reviews />
      </main>

      <footer className='bg-primary text-accent border-t-2 border-accent py-4 mt-12'>
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
    queryFn: () => fetchData('/api/reviews'),
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
    <section id='reviews'>
      <div className='container mx-auto px-4'>
        <h3 className='text-2xl font-semibold text-accent mb-6'>
          Customer Reviews
        </h3>

        <Card className='bg-secondary mb-6'>
          <CardHeader>
            <CardTitle className='text-accent'>Leave a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                  control={form.control}
                  name='customerName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-accent'>Name</FormLabel>
                      <FormControl>
                        <Input className='bg-primary' placeholder='Your name' {...field} />
                      </FormControl>
                      <FormMessage className='text-red-500' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='starRating'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='bg-primary'>
                            <SelectValue placeholder='Select a rating' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map((num) => (
                            <SelectItem key={num} value={num.toString()} className='text-accent bg-primary hover:bg-primary/90 hover:text-primary'>
                              {num} Star{num !== 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className='text-red-500' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='comment'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-accent'>Comment</FormLabel>
                      <FormControl className='bg-primary'>
                        <Textarea
                          placeholder='Tell us about your experience'
                          className='resize-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className='text-red-500' />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className={`bg-accent text-primary hover:bg-accent/70 ${isSubmitting ? 'cursor-not-allowed bg-secondary' : ''
                    }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className='bg-accent text-primary py-16'>
        <div className='contgainer mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 '>
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
              <Card key={index} className='bg-secondary' data-aos="fade-up">
                <CardHeader>
                  <CardTitle className='text-accent flex items-center justify-between'>
                    <span>{review.customerName}</span>
                    <span className='flex items-center'>
                      {[...Array(review.starRating)].map((_, i) => (
                        <Star
                          key={i}
                          className='w-5 h-5 fill-accent'
                        />
                      ))}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className='text-accent'>
                  <p>{review.comment}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
