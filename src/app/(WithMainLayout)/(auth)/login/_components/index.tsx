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
import googleIcon from '@/assets/icons/google.png';
import Image from 'next/image';
import { AppButton } from '@/components/shared/app-button';
import Link from 'next/link';
import { loginSchema } from './loginValidation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { setUser, TUser } from '@/redux/features/auth/authSlice';
import { verifyToken } from '@/utils/verifyToken';
import { toast } from 'sonner';
import Cookies from 'js-cookie';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();

  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirectPath');
  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await login(data).unwrap();
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
      Cookies.set('accessToken', accessToken, { expires: 1, sameSite: 'lax' });
      toast.success(response.message || 'Login successful');
      form.reset();

      if (redirect) {
        router.push(decodeURIComponent(redirect));
        return;
      }

      if (user.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else if (user.role === 'team_member') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error?.message ||
        'An unexpected error occurred during login.';
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
      className="flex justify-center items-center min-h-screen py-20"
    >
      <div className="bg-white p-4 lg:p-8 rounded-xl border shadow-md lg:w-1/3 w-full mx-3">
        <h3 className="text-sm text-gray-700 uppercase font-medium">
          Welcome Back
        </h3>
        <h2 className="text-2xl font-medium mb-6 mt-1">
          Sign In to your Account
        </h2>
        {/* Form Inputs */}
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

            {/* Forgot Password */}
            <div className="flex justify-end mr-5 items-center mt-5 mb-1">
              {/* <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  className="cursor-pointer"
                />
                <FormLabel className="text-sm" htmlFor="terms">
                  Remember Me
                </FormLabel>
              </div> */}
              <Link
                href={'/forgot-password'}
                className="text-sm underline text-green-700"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  <p className="uppercase">
                    {isSubmitting ? 'Signing In...' : 'Sign In'}
                  </p>
                  <ArrowRight />
                </div>
              }
            />
            <p className="text-center text-base mt-2">
              Don’t have an account?{' '}
              <Link
                href="/user-role"
                className="text-black font-bold underline"
              >
                SIGN UP HERE
              </Link>
            </p>
          </form>
        </Form>

        <div className="my-3 text-center text-xs text-gray-500">OR USE</div>

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
          {/* <Button
            variant="outline"
            className="w-full rounded-full py-6 flex gap-2 justify-center cursor-pointer"
          >
            <Image src={phoneIcon} alt="phone" />
            <span className="font-medium text-lg text-[#165940]">
              Sign In with Phone Number
            </span>
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
