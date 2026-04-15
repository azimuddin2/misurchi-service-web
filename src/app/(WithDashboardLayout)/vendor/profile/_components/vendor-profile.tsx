'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'sonner';
import { currencyOptions } from '@/constants/currency';
import { timezonesOptions } from '@/constants/timezones';
import { workHourOptions } from '@/constants/workHour';
import { AppButton } from '@/components/shared/app-button';
import { PhoneInput } from '@/components/ui/core/phone-input';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useEffect, useState } from 'react';

import { TVendorUser } from '@/types';
import Spinner from '@/components/shared/Spinner';
import CountryStateCitySelector from '@/components/ui/core/country-state-city-selector';
import MSWImageUploader from '@/components/ui/core/MSWImageUploader';
import ImagePreviewer from '@/components/ui/core/MSWImageUploader/ImagePreviewer';
import {
  useGetVendorProfileQuery,
  useUpdateVendorProfileMutation,
} from '@/redux/features/vendor/vendorApi';
import CoverImageUploader from '@/components/ui/core/CoverImageUploader';
import CoverImagePreview from '@/components/ui/core/CoverImageUploader/CoverImagePreview';
import LocationMap from '@/components/shared/location-map';
import { zodResolver } from '@hookform/resolvers/zod';
import { vendorProfileSchema } from './profileValidation';

const VendorProfile = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);
  const [coverImageFiles, setCoverImageFiles] = useState<File[] | []>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string[] | []>([]);

  const { data, isLoading, refetch } = useGetVendorProfileQuery(email);
  const vendorUser: TVendorUser | undefined = data?.data;

  const [updateVendorProfile] = useUpdateVendorProfileMutation();

  const form = useForm({
    resolver: zodResolver(vendorProfileSchema),
    defaultValues: {
      businessName: '',
      email: '',
      phone: '',
      country: '',
      street: '',
      state: '',
      zipCode: '',
      currency: '',
      timeZone: '',
      workHours: '',
      firstName: '',
      lastName: '',
      description: '',
      latitude: '',
      longitude: '',
      streetAddress: '',
    },
  });

  // Reset form values when vendorUser is available
  useEffect(() => {
    if (vendorUser) {
      form.reset({
        businessName: vendorUser.businessName || '',
        email: vendorUser.email || '',
        phone: vendorUser.phone || '',
        country: vendorUser.country || '',
        street: vendorUser.street || '',
        state: vendorUser.state || '',
        zipCode: vendorUser.zipCode || '',
        currency: vendorUser.currency || '',
        timeZone: vendorUser.timeZone || '',
        workHours: vendorUser.workHours || '',
        firstName: vendorUser.firstName || '',
        lastName: vendorUser.lastName || '',
        description: vendorUser.description || '',

        latitude: vendorUser.location?.coordinates?.[1]
          ? String(vendorUser.location.coordinates[1])
          : '',
        longitude: vendorUser.location?.coordinates?.[0]
          ? String(vendorUser.location.coordinates[0])
          : '',
        streetAddress: vendorUser.location?.streetAddress || '',
      });
      setCoverImagePreview(
        vendorUser.coverImage ? [vendorUser.coverImage] : [],
      );
      setImagePreview(vendorUser.image ? [vendorUser.image] : []);
    }
  }, [vendorUser, form]);

  const {
    formState: { isSubmitting },
  } = form;

  const { register, setValue, control } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const { latitude, longitude, streetAddress, ...rest } = data;

    const payload = {
      ...rest,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)], // [lng, lat]
        streetAddress: streetAddress,
      },
    };

    console.log('Payload to be sent:', payload);

    const formData = new FormData();
    formData.append('data', JSON.stringify(payload));

    imageFiles.forEach((file) => formData.append('profile', file));
    coverImageFiles.forEach((file) => formData.append('coverImage', file));

    const toastId = toast.loading('Updating profile...');

    try {
      const res = await updateVendorProfile({
        email: email,
        body: formData,
      }).unwrap();
      toast.success(res.message || 'Profile update successfully');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add product');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleShare = () => {
    navigator?.share({
      title: vendorUser?.businessName,
      url: `/providers/${vendorUser?._id}`,
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white rounded-lg flex-grow max-w-5xl p-4 lg:p-8 shadow">
      <div className="flex flex-col rounded-b-2xl overflow-hidden mb-5">
        {/* Cover Image */}
        <div className="w-full flex flex-col items-center">
          {/* When no image uploaded yet */}
          {coverImageFiles.length < 1 && coverImagePreview.length < 1 && (
            <div className="w-full">
              <CoverImageUploader
                setCoverImageFiles={setCoverImageFiles}
                setCoverImagePreview={setCoverImagePreview}
                label="Upload Cover Image"
                className="rounded-lg bg-white w-full"
              />
            </div>
          )}

          {/* When images are uploaded */}
          {coverImagePreview.length > 0 && (
            <div className="w-full max-w-5xl">
              <CoverImagePreview
                setCoverImageFiles={setCoverImageFiles}
                coverImagePreview={coverImagePreview}
                setCoverImagePreview={setCoverImagePreview}
              />
            </div>
          )}
        </div>

        {/* Profile Image */}
        <div className="-mt-20 relative">
          <div className=" overflow-hidden relative mx-auto">
            <div className="flex gap-4">
              {imageFiles.length < 1 && imagePreview.length < 1 && (
                <MSWImageUploader
                  setImageFiles={setImageFiles}
                  setImagePreview={setImagePreview}
                  label="Upload Image"
                  className="w-1/2 lg:w-fit mx-auto rounded-lg bg-white"
                />
              )}

              {imagePreview.length > 0 && (
                <ImagePreviewer
                  className="flex flex-wrap gap-4 mx-auto"
                  setImageFiles={setImageFiles}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              )}
            </div>
          </div>
        </div>
        {/* Share Button */}
        <div className="mt-3 mb-6 text-center">
          <button
            className="flex items-center justify-center w-4/5 lg:w-2/6 mx-auto text-black border-gray-800 bg-gradient-to-t to-[#d6fbf7] from-[#c0eae5] hover:bg-green-500/80 p-4 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500"
            onClick={handleShare}
          >
            <p className="uppercase font-semibold mr-2">SHARE YOUR PROFILE</p>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

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
                    type="text"
                    placeholder="Enter your business name"
                    {...field}
                    value={field.value || ''}
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
                    value={field.value || ''}
                    className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    disabled
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

          {/* Country, State, City Selector */}
          <div className="grid w-full items-center mb-5">
            <CountryStateCitySelector
              control={control}
              setValue={setValue}
              register={register}
              userAddress={{
                country: vendorUser?.country || '',
                state: vendorUser?.state || '',
              }}
            />
          </div>

          {/* Street */}
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Street Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    placeholder="Enter your street address"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* State and Zip */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="lg:mb-0 mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Zip Code
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Type Zip Code"
                    {...field}
                    value={field.value || ''}
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
                    value={field.value || vendorUser?.currency}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem className="lg:mb-0 mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Time Zone
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || vendorUser?.timeZone}
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
                    defaultValue={field.value || vendorUser?.workHours}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
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

          {/*  Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Description
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

          {/* Replace this static map */}
          <div className="mt-8 space-y-2">
            <label className="text-gray-700 text-base font-medium">
              Business Location
            </label>
            <LocationMap
              coordinates={
                vendorUser?.location?.coordinates?.length === 2
                  ? [
                      vendorUser.location.coordinates[1],
                      vendorUser.location.coordinates[0],
                    ]
                  : undefined
              }
              onLocationChange={({ lat, lng, address }) => {
                setValue('latitude', String(lat));
                setValue('longitude', String(lng));
                setValue('streetAddress', address);
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-3">
            {/* Submit Button */}
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  <p className="uppercase">
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </p>
                  <ArrowRight />
                </div>
              }
            />

            <div className="p-3 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80">
              <Link
                href={`/`}
                className="w-full inline-flex justify-center items-center space-x-1 font-semibold"
              >
                <span className="uppercase text-sm font-semibold">Cancel</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default VendorProfile;
