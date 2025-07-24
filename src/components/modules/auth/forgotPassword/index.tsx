'use client';

import { Input } from '@/components/ui/input';
import rectangleBgImg from '@/assets/images/rectangle.png';
import { ArrowRight } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppButton } from '@/components/shared/app-button';
import { forgotPasswordSchema } from './forgotPasswordValidation';

const ForgotPasswordForm = () => {
  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      console.log(data);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${rectangleBgImg.src})`,
        backgroundSize: 'contain',
        width: '100%',
        backgroundRepeat: 'no-repeat',
      }}
      className="flex justify-center items-center min-h-screen p-2"
    >
      <div className="bg-white p-4 py-6 lg:py-10 lg:p-6 rounded-xl border shadow-md lg:w-1/3">
        <div>
          <h3 className="text-sm text-gray-700 uppercase font-medium">
            ENTER EMAIL ADDRESS TO RECEIVE VERFICATION CODE
          </h3>
          <h2 className="text-2xl font-medium mb-6 mt-1">Forgot Password</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="Enter your email address"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Submit Button */}
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  <p className="uppercase">Submit</p>
                  <ArrowRight />
                </div>
              }
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
