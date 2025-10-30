'use client';

import { Input } from '@/components/ui/input';
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
import { useChangePasswordMutation } from '@/redux/features/auth/authApi';
import { TResponse } from '@/types';
import { toast } from 'sonner';
import { TChangePassword } from '@/types/auth.type';
import { changePasswordSchema } from './changePasswordValidation';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const [changePassword] = useChangePasswordMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading('Update Password...');

    try {
      const res = (await changePassword(data)) as TResponse<
        TChangePassword | any
      >;

      if (res.error) {
        toast.error(res?.error?.data?.message);
      } else {
        toast.success(res?.data?.message);
        form.reset();
      }
    } catch (error: any) {
      const message = error?.data?.message || error?.message;
      toast.error(message);
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="font-sora">
      <h2 className="text-2xl font-semibold py-2 mb-4">Change Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Old Password */}
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="relative mb-5">
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Current Password
                </FormLabel>
                <FormControl>
                  <Input
                    type={currentPassword ? 'text' : 'password'}
                    placeholder="Enter your current password"
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
                  onClick={() => setCurrentPassword((prev) => !prev)}
                >
                  {currentPassword ? (
                    <EyeOff className="w-6 h-6" />
                  ) : (
                    <Eye className="w-6 h-6" />
                  )}
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* Confirm New Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="relative mb-5">
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Confirm New Password
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
                <ArrowRight className="ml-2" />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
};

export default ChangePassword;
