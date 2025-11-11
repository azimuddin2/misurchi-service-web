'use client';

import { Input } from '@/components/ui/input';
import { ArrowRight, MapPin } from 'lucide-react';
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
import { AppButton } from '@/components/shared/app-button';
import { PhoneInput } from '@/components/ui/core/phone-input';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useEffect, useState } from 'react';
import Spinner from '@/components/shared/Spinner';
import MSWImageUploader from '@/components/ui/core/MSWImageUploader';
import ImagePreviewer from '@/components/ui/core/MSWImageUploader/ImagePreviewer';
import { IUser } from '@/types';
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '@/redux/features/user/userApi';
import LocationMap from '@/components/shared/location-map';
import CoverImageUploader from '@/components/ui/core/CoverImageUploader';
import CoverImagePreview from '@/components/ui/core/CoverImageUploader/CoverImagePreview';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const email = user?.email as string;
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);
  const [coverImageFiles, setCoverImageFiles] = useState<File[] | []>([]);
  const [coverImagePreview, setCoverImagePreview] = useState<string[] | []>([]);

  const { data, isLoading, refetch } = useGetUserProfileQuery(email);
  const userData: IUser | undefined = data?.data;

  const [updateUserProfile] = useUpdateUserProfileMutation();

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: {
        streetAddress: '',
        coordinates: { lat: 0, lng: 0 },
      },
    },
  });

  // Reset form values when vendorUser is available
  useEffect(() => {
    if (userData) {
      form.reset({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
      });
      setCoverImagePreview(userData.coverImage ? [userData.coverImage] : []);
      setImagePreview(userData.image ? [userData.image] : []);
    }
  }, [userData, form]);

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log(data);
    // const formData = new FormData();

    // // Backend expects JSON string for other fields
    // formData.append('data', JSON.stringify(data));

    // // Append profile image(s)
    // imageFiles.forEach((file) => {
    //   formData.append('profile', file);
    // });

    // // Append cover image(s)
    // coverImageFiles.forEach((file) => {
    //   formData.append('coverImage', file);
    // });

    // const toastId = toast.loading('Updating Profile...');
    // try {
    //   const res = await updateUserProfile({
    //     email: email,
    //     body: formData,
    //   }).unwrap();

    //   toast.success(res.message || 'Profile update successfully');
    //   refetch();
    // } catch (error: any) {
    //   toast.error(error?.data?.message || 'Failed to update profile');
    // } finally {
    //   toast.dismiss(toastId);
    // }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="bg-white rounded-lg flex-grow max-w-5xl mx-auto p-4 lg:p-8 shadow mb-12">
      <div className="flex flex-col rounded-b-2xl overflow-hidden">
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
            onClick={() => router.push('/signup/vendor')}
          >
            <p className="uppercase font-semibold mr-2">
              Register as a service provider
            </p>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {/* First Name */}
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

            {/* Last Name  */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      readOnly
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
          </div>

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="lg:mb-0 mb-5">
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Location
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Enter your location"
                      {...field}
                      value={field.value?.streetAddress || ''}
                      onChange={(e) =>
                        form.setValue('location', {
                          ...field.value,
                          streetAddress: e.target.value,
                        })
                      }
                      className="bg-[#f5f5f5] py-6 pr-10 border-none rounded-sm"
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Google Map Preview */}
          <LocationMap
            streetAddress={form.watch('location.streetAddress') || ''}
            coordinates={form.watch('location.coordinates') || null}
          />

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

export default UserProfile;
