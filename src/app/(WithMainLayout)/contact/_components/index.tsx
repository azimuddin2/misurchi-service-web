'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { AppButton } from '@/components/shared/app-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from './contactValidation';
import { toast } from 'sonner';
import { useAddSupportMutation } from '@/redux/features/support/supportApi';

export default function Contact() {
  const [rating, setRating] = useState<number | null>(null);
  const [followUp, setFollowUp] = useState<boolean | null>(null);

  const form = useForm({
    resolver: zodResolver(contactSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const emojis = [
    { value: 1, label: 'Poor', emoji: '😔' },
    { value: 2, label: 'Average', emoji: '😐' },
    { value: 3, label: 'Medium', emoji: '🙂' },
    { value: 4, label: 'Good', emoji: '😎' },
    { value: 5, label: 'Very Good', emoji: '😁' },
  ];

  const [addSupport] = useAddSupportMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const supportData = {
      ...data,
      follow: Boolean(followUp),
    };

    const toastId = toast.loading('Submitting your request...');

    try {
      const response = await addSupport(supportData).unwrap();

      toast.success(
        response?.message ||
          'Your support request has been submitted successfully!',
        {
          id: toastId,
        },
      );

      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
      });
      setFollowUp(null);
      setRating(null);
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        'Failed to submit your request. Please try again later.';

      toast.error(errorMessage, {
        id: toastId,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Contact Us - Share Your Feedback
      </h1>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-600">123A, Washington, UK</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-600">+123456789</span>
        </div>
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-600">Cleancrypt@gmail.com</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-600">Available 24/7</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
          <p className="mb-3">Rate your experience</p>
          <div className="flex justify-between max-w-xs mx-auto">
            {emojis.map((item) => (
              <div key={item.value} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setRating(item.value)}
                  className={`text-3xl mb-1 focus:outline-none ${
                    rating === item.value ? 'transform scale-125' : ''
                  }`}
                  aria-label={item.label}
                >
                  {item.emoji}
                </button>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="lg:mb-0 mb-5">
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="First Name"
                        {...field}
                        value={field.value || ''}
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        {...field}
                        value={field.value || ''}
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter business email address"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium lg:mt-5">
                    Do you have any thoughts {"you'd"} like to share?
                  </FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={8}
                      className="bg-[#f5f5f5] py-4 px-4 border-none rounded-sm w-full"
                      placeholder="Enter description here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mb-6">
              <p className="mb-2">
                May we follow you up on your Feedback History?
              </p>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setFollowUp(true)}
                  className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                    followUp === true
                      ? 'bg-green-700 border-green-700'
                      : 'border-gray-300'
                  }`}
                  aria-label="Yes"
                >
                  {followUp === true && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </button>
                <span>Yes</span>

                <button
                  type="button"
                  onClick={() => setFollowUp(false)}
                  className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                    followUp === false
                      ? 'bg-green-700 border-green-700'
                      : 'border-gray-300'
                  }`}
                  aria-label="No"
                >
                  {followUp === false && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </button>
                <span>No</span>
              </div>
            </div>

            {/* Submit Button */}
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  <p className="uppercase">
                    {isSubmitting
                      ? 'Submitting Feedback...'
                      : 'Submit Feedback'}
                  </p>
                  <ArrowRight />
                </div>
              }
            />
          </form>
        </Form>
      </div>

      <div className="mt-8 h-full rounded-lg overflow-hidden">
        <div
          style={{
            width: '100%',
          }}
        >
          <iframe
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="no"
            src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=123A,%20Washington,%20UK+(Soft%20Technology)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          >
            <a href="https://www.gps.ie/collections/sports-gps/">Cycling gps</a>
          </iframe>
        </div>
      </div>
    </div>
  );
}
