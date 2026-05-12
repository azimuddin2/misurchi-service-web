'use client';

import { AppButton } from '@/components/shared/app-button';
import { ArrowRight, Clock } from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAddTaskMutation } from '@/redux/features/task/taskApi';
import { useGetAllMembersQuery } from '@/redux/features/member/memberApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from './taskValidation';

const AddTask = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>('');

  const user = useAppSelector(selectCurrentUser);
  const router = useRouter();

  // Generate times every 30 minutes for one day, starting at midnight
  const times = useMemo(() => {
    const list: Date[] = [];
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0);
    for (let i = 0; i < 48; i++) {
      const t = new Date(baseDate.getTime() + i * 30 * 60 * 1000);
      list.push(t);
    }
    return list;
  }, []);

  const form = useForm({
    resolver: zodResolver(taskSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const vendorId = user?.vendorId as string;

  const { data, refetch } = useGetAllMembersQuery({
    vendorId,
  });

  const members = data?.data || [];

  const [AddTask] = useAddTaskMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!date) {
      toast.error('Please select a date');
      return;
    }
    if (!time) {
      toast.error('Please select a time');
      return;
    }

    const taskData = {
      vendor: vendorId,
      ...data,
      date:
        date instanceof Date
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
              date.getDate(),
            ).padStart(2, '0')}`
          : date,
      time,
    };

    console.log('Submitting Task Data:', taskData);

    const toastId = toast.loading('Adding task...');

    try {
      const res = await AddTask(taskData).unwrap();

      console.log(res);

      toast.success(res.message || 'Task added successfully');
      router.push(`/vendor/task-hub`);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add task');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="bg-white rounded-lg grow max-w-5xl p-4 lg:p-8 shadow">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="lg:mb-0 mb-5">
                <FormLabel className="text-gray-700! text-base! font-medium">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter Task Title"
                    {...field}
                    value={field.value || ''}
                    className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700! text-base! font-medium lg:mt-5">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
            {/* Date */}
            <div>
              <FormLabel className="text-gray-700! text-base! font-medium mb-2">
                Estimated completion date
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-picker"
                    variant="outline"
                    className={cn(
                      'w-full justify-between text-left font-normal bg-[#f5f5f5] py-6 border-none rounded-sm',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <span>
                      {date ? format(date, 'dd MMM, yyyy') : 'Pick a date'}
                    </span>
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div>
              <FormLabel className="text-gray-700! text-base! font-medium mb-2">
                Estimated completion Time
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="time-picker"
                    variant="outline"
                    className={cn(
                      'w-full justify-between text-left font-normal bg-[#f5f5f5] py-6 border-none rounded-sm',
                      !time && 'text-muted-foreground',
                    )}
                  >
                    {time || 'Pick a time'}
                    <Clock className="h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-2 max-h-[250px] overflow-y-auto">
                  {times.map((t, idx) => {
                    const formattedTime = format(t, 'h:mm a');
                    return (
                      <Button
                        key={idx}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setTime(formattedTime)}
                      >
                        {formattedTime}
                      </Button>
                    );
                  })}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Assign to member */}
          <FormField
            control={form.control}
            name="assignTeamMember"
            render={({ field }) => (
              <FormItem className="lg:mb-0 mb-5">
                <FormLabel className="!text-gray-700 !text-base font-medium">
                  Assign to
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
                    {members?.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.firstName} {member.lastName} ({member.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <AppButton
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 mt-5"
            content={
              <div className="flex justify-center items-center space-x-2 font-semibold uppercase">
                <p>{isSubmitting ? 'Saving...' : 'Save'}</p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
};

export default AddTask;
