'use client';

import { AppButton } from '@/components/shared/app-button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import MSWImageUploader from '@/components/ui/core/MSWImageUploader';
import ImagePreviewer from '@/components/ui/core/MSWImageUploader/ImagePreviewer';
import { toast } from 'sonner';
import { timezonesOptions } from '@/constants/timezones';
import { workHourOptions } from '@/constants/workHour';
import { roleOptions } from '@/constants/teamMemberRoles';
import { PhoneInput } from '@/components/ui/core/phone-input';
import {
  useGetMemberByIdQuery,
  useUpdateMemberMutation,
} from '@/redux/features/member/memberApi';
import { TMember } from '@/types/member.type';
import { updateMemberSchema } from './updateMemberValidation';
import Link from 'next/link';

type Props = {
  memberId: string;
};

const UpdateMember = ({ memberId }: Props) => {
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  const { data } = useGetMemberByIdQuery(memberId);
  const member: TMember | undefined = data?.data;

  const [updateMember] = useUpdateMemberMutation();

  const form = useForm({
    resolver: zodResolver(updateMemberSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: '',
      speciality: '',
      timeZone: '',
      workHours: '',
      phone: '',
    },
  });

  // whenever `member` changes, reset the form values
  useEffect(() => {
    if (member) {
      form.reset({
        firstName: member.firstName ?? '',
        lastName: member.lastName ?? '',
        email: member.email ?? '',
        role: member.role ?? '',
        speciality: member.speciality ?? '',
        timeZone: member.timeZone ?? '',
        workHours: member.workHours ?? '',
        phone: member.phone ?? '',
      });

      setImagePreview(member.image ? [member.image] : []);
    }
  }, [member, form]);

  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const modifiedData = {
      ...data,
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(modifiedData)); //✅Backend expects JSON string

    imageFiles.forEach((file) => {
      formData.append('image', file); //✅Append multiple images
    });

    const toastId = toast.loading('Updating Team Member...');

    try {
      const res = await updateMember({
        id: memberId,
        body: formData,
      }).unwrap();

      toast.success(res.message || 'Member updated successfully');
      router.push(`/vendor/team-members`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update member');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="bg-white rounded-lg flex-grow max-w-4xl p-4 lg:p-8 shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Images part */}
          <div className="flex gap-4">
            {imagePreview.length < 1 && (
              <MSWImageUploader
                setImageFiles={setImageFiles}
                setImagePreview={setImagePreview}
                label="Upload Image"
                className="w-full lg:w-fit"
              />
            )}

            {imagePreview.length > 0 && (
              <ImagePreviewer
                className="flex flex-wrap gap-4"
                setImageFiles={setImageFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            )}
          </div>

          {/* data input fields */}
          <div>
            {/* First and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-1">
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
                  <FormLabel className="!text-gray-700 !text-base font-medium mt-5">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      {...field}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="lg:mb-0 mb-5">
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Role
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                          <SelectValue placeholder="Team Member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {roleOptions.map((tz) => (
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

              {/* Speciality */}
              <FormField
                control={form.control}
                name="speciality"
                render={({ field }) => (
                  <FormItem className="lg:mb-0 mb-5">
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Speciality
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Speciality"
                        {...field}
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Time Zone */}
              <FormField
                control={form.control}
                name="timeZone"
                render={({ field }) => (
                  <FormItem className="lg:mb-0 mb-5 lg:mt-3">
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Time Zone
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
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

              {/* Work Hours */}
              <FormField
                control={form.control}
                name="workHours"
                render={({ field }) => (
                  <FormItem className="lg:mt-3">
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Work Hours
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
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
                      value={field.value}
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

          {/* Submit Button */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-3">
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  <p>{isSubmitting ? 'Updating...' : 'Update'}</p>
                  <ArrowRight />
                </div>
              }
            />

            <div className="p-3 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 w-full text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80">
              <Link
                href={`/${user?.role || 'vendor'}/team-members`}
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

export default UpdateMember;
