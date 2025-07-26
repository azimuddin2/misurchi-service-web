'use client';

import { Input } from '@/components/ui/input';
import rectangleBgImg from '@/assets/images/rectangle.png';
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
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
import { resetPasswordSchema } from './resetPasswordValidation';
import { useResetPasswordMutation } from '@/redux/features/auth/authApi';
import { IUser, TResponse } from '@/types';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirectPath');
  const router = useRouter();

  const [resetPassword] = useResetPasswordMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = (await resetPassword(data)) as TResponse<IUser | any>;

      if (res.error) {
        toast.error(res?.error?.data?.message);
      } else {
        toast.success(res?.data?.message);
        router.push(redirect || '/');
      }
    } catch (error: any) {
      const message = error?.data?.message || error?.message;
      toast.error(message);
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
      className="flex justify-center items-center min-h-screen p-3"
    >
      <div className="bg-white p-4 py-8 lg:p-8 rounded-xl shadow-md w-full lg:w-1/3">
        <div>
          <h3 className="text-sm text-gray-700 uppercase font-medium">
            SAVE NEW PASSWORD
          </h3>
          <h2 className="text-2xl font-medium mb-6 mt-1">Set New Password</h2>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* New Password */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="relative mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-8"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="relative mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Enter your confirm password"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-8"
                    onClick={() => setShowConfirm((prev) => !prev)}
                  >
                    {showConfirm ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  {isSubmitting ? 'Updating Password...' : 'Update Password'}
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

export default ResetPasswordForm;
