'use client';

import { AppButton } from '@/components/shared/app-button';
import { ArrowRight, CircleCheck, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { roleOptions } from '@/constants/teamMemberRoles';
import { PhoneInput } from '@/components/ui/core/phone-input';
import { addMemberSchema } from './addMemberValidation';
import { useAddMemberMutation } from '@/redux/features/member/memberApi';

const AddMember = () => {
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(addMemberSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  // handle Assign Task!
  const handleAdd = () => {
    const value = (form.getValues('assignTask') ?? '').trim();
    if (value && !tasks.includes(value)) {
      setTasks((prev) => [...prev, value]);
      form.setValue('assignTask', '');
    }
  };
  const handleRemove = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const [addMember] = useAddMemberMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const modifiedData = {
      user: user?.userId,
      ...data,
      assignTask: tasks,
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(modifiedData)); //✅Backend expects JSON string

    imageFiles.forEach((file) => {
      formData.append('image', file); //✅Append multiple images
    });

    const toastId = toast.loading('Adding Team Member...');

    try {
      const res = await addMember(formData).unwrap();
      console.log(res);

      toast.success(res.message || 'Product added successfully');
      router.push(`/vendor/team-members`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add product');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="bg-white rounded-lg flex-grow max-w-4xl p-4 lg:p-8 shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Images part */}
          <div className="mb-10">
            <div className="flex justify-center gap-4">
              {imageFiles.length < 1 && (
                <MSWImageUploader
                  setImageFiles={setImageFiles}
                  setImagePreview={setImagePreview}
                  label="Upload Image"
                  className="w-full lg:w-full mx-auto"
                />
              )}

              <ImagePreviewer
                className="flex flex-wrap gap-4 mx-auto"
                setImageFiles={setImageFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            </div>
          </div>

          {/* data input fields */}

          <div>
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="lg:mb-0 mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Name"
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
                  <FormLabel className="!text-gray-700 !text-base font-medium mt-5">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      {...field}
                      value={field.value || ''}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="lg:mb-0 mb-5">
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Role
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
                        value={field.value || ''}
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
                  <FormItem className="lg:mb-0 mb-5">
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

              {/* Work Hours */}
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

            <div className="my-5">
              {/* Assign Task */}
              <FormField
                control={form.control}
                name="assignTask"
                render={({ field }) => (
                  <FormItem className="lg:mb-0 mb-5">
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Assign Task
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Task"
                        {...field}
                        value={field.value || ''}
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-2 flex justify-center mt-5 cursor-pointer text-sm shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 w-1/4 text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80">
                <button
                  type="button"
                  onClick={handleAdd}
                  className=" inline-flex justify-center items-center space-x-1 font-semibold bg-none"
                >
                  <PlusCircle size={20} />
                  <span className="uppercase text-sm font-semibold">
                    Add Task
                  </span>
                </button>
              </div>

              <div className="space-y-2 grid grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border rounded-md px-4 py-2"
                  >
                    <div className="flex">
                      <CircleCheck className="text-green-500" size={18} />
                      <span className="mx-2">{task}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500 rounded-full cursor-pointer" />
                    </Button>
                  </div>
                ))}
              </div>
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

          {/* Submit Button */}
          <AppButton
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
            content={
              <div className="flex justify-center items-center space-x-2 font-semibold">
                <p>{isSubmitting ? 'Saveing...' : 'Save'}</p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
};

export default AddMember;
