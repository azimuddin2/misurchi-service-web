'use client';

import { Input } from '@/components/ui/input';
import rectangleBgImg from '@/assets/images/rectangle.png';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff } from 'lucide-react';
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
import { providerSignupSchema } from './providerSignupValidation';
import CountryStateCitySelector from '@/components/ui/core/country-state-city-selector';
import googleIcon from '@/assets/icons/google.png';
import phoneIcon from '@/assets/icons/phone.png';
import Image from 'next/image';
import { currencyOptions } from '@/constants/currency';
import { timezonesOptions } from '@/constants/timezones';
import { workHourOptions } from '@/constants/workHour';

const ProviderSignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    resolver: zodResolver(providerSignupSchema),
  });

  const { register, setValue, control } = form;

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      console.log(data);
      // const res = await registerUser(data);
      // if (res?.success) {
      //     toast.success(res?.message);
      //     form.reset();
      // } else {
      //     toast.error(res?.message);
      // }
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
      className="flex justify-center items-center py-20"
    >
      <div className="bg-white p-5 lg:p-6 rounded-xl shadow-md lg:w-1/3">
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
            {/* Business Name */}
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Business Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your business name"
                      {...field}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                <FormItem className="mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      type="tel"
                      placeholder="Enter business phone number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country, State, City Selector */}
            <div className="grid w-full  items-center mb-5">
              <CountryStateCitySelector
                control={control}
                setValue={setValue}
                register={register}
              />
            </div>

            {/* Street */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Street
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      placeholder="Enter your street address"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* State and Zip */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Zip Code
                    </FormLabel>
                    <Input
                      type="text"
                      placeholder="Type Zip Code"
                      {...field}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency */}
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Currency
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {currencyOptions.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.name} ({currency.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Time Zone & Work Hours */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Time Zone
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                          <SelectValue placeholder="Time Zone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {timezonesOptions.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
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
                name="workHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Work Hours
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                          <SelectValue placeholder="Work Hours" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workHourOptions.map((wh) => (
                          <SelectItem key={wh.value} value={wh.value}>
                            {wh.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* First and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        {...field}
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
                        placeholder="Last Name"
                        {...field}
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              <li>Minimum of 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one number</li>
              <li>At least one special character (e.g., !@#$%^&*)</li>
            </ul>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-green-400 to-emerald-600"
            >
              SIGN UP →
            </Button>

            <p className="text-center text-sm mt-4">
              Have an account?{' '}
              <a href="/login" className="text-black font-medium underline">
                SIGN IN HERE
              </a>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProviderSignupForm;
