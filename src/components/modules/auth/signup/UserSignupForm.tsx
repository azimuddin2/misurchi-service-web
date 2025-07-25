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
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import googleIcon from '@/assets/icons/google.png';
import phoneIcon from '@/assets/icons/phone.png';
import Image from 'next/image';
import { AppButton } from '@/components/shared/app-button';
import Link from 'next/link';
import { IoCheckbox } from 'react-icons/io5';
import { PhoneInput } from '@/components/ui/core/phone-input';
import { userSignupSchema } from './userSignupValidation';
import { useAppDispatch } from '@/redux/hooks';
import { useUserSignupMutation } from '@/redux/features/auth/authApi';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyToken } from '@/utils/verifyToken';
import { setUser, TUser } from '@/redux/features/auth/authSlice';

const UserSignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(userSignupSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const dispatch = useAppDispatch();
  const [signup] = useUserSignupMutation();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirectPath');
  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await signup(data).unwrap();

      const accessToken = response?.data?.accessToken;
      if (!accessToken) {
        toast.error('Access token missing from server response.');
        return;
      }

      const user = verifyToken(accessToken) as TUser;
      if (!user) {
        toast.error('Invalid access token.');
        return;
      }

      dispatch(setUser({ user, token: accessToken }));
      toast.success(response.message || 'User registered successfully');
      form.reset();

      router.push(redirect || '/verify-otp');
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        'An unexpected error occurred during signup.';
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
      className="flex justify-center items-center py-20"
    >
      <div className="bg-white p-4 lg:p-6 rounded-xl shadow-md lg:w-1/3">
        <h3 className="text-sm text-gray-700 uppercase font-medium">
          Let's get you started
        </h3>
        <h2 className="text-2xl font-medium mb-6 mt-1">
          Sign Up to your Account
        </h2>

        {/* Social Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full py-6 rounded-full flex gap-2 justify-center bg-gradient-to-r from-blue-100 to-green-100 cursor-pointer"
          >
            <Image src={googleIcon} alt="Google" />
            <span className="font-medium text-lg text-[#165940]">
              Sign In with Google
            </span>
          </Button>
          <Button
            variant="outline"
            className="w-full rounded-full py-6 flex gap-2 justify-center cursor-pointer"
          >
            <Image src={phoneIcon} alt="phone" />
            <span className="font-medium text-lg text-[#165940]">
              Sign In with Phone Number
            </span>
          </Button>
        </div>

        <div className="my-4 text-center text-xs text-gray-500">OR USE</div>

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

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <PhoneInput
                      // @ts-ignore
                      value={field.value || ''}
                      onChange={field.onChange}
                      international
                      defaultCountry="US"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="relative mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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

            {/* Password Requirements */}
            <ul className="text-xs text-gray-500 space-y-1 pl-2 list-disc">
              <li className="list-none flex items-center">
                <IoCheckbox size={18} />
                <span className="ml-1 text-sm font-medium">
                  Minimum of 8 characters
                </span>
              </li>
              <li className="list-none flex items-center">
                <IoCheckbox size={18} />
                <span className="ml-1 text-sm font-medium">
                  At least one uppercase letter
                </span>
              </li>
              <li className="list-none flex items-center">
                <IoCheckbox size={18} />
                <span className="ml-1 text-sm font-medium">
                  At least one lowercase letter
                </span>
              </li>
              <li className="list-none flex items-center">
                <IoCheckbox size={18} />
                <span className="ml-1 text-sm font-medium">
                  At least one number
                </span>
              </li>
              <li className="list-none flex items-center">
                <IoCheckbox size={18} />
                <span className="ml-1 text-sm font-medium">
                  At least one special character (e.g., !@#$%^&*)
                </span>
              </li>
            </ul>

            {/* Submit Button */}
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  <p className="uppercase">Sign Up</p>
                  <ArrowRight />
                </div>
              }
            />

            <p className="text-center text-base mt-2">
              Have an account?{' '}
              <Link href="/login" className="text-black font-bold underline">
                SIGN IN HERE
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UserSignupForm;
