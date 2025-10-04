'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { AppButton } from '@/components/shared/app-button';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { TBooking } from '@/types/booking.type';
import { useGetAllMembersQuery } from '@/redux/features/member/memberApi';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookingAssignedToMemberMutation } from '@/redux/features/booking/bookingApi';

interface AddAssignModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  refetch?: () => void;
  bookingData: TBooking | null;
}

// ✅ Validation schema
const assignSchema = z.object({
  assignedTo: z.string().min(1, 'Please select a member'),
});

type FormValues = z.infer<typeof assignSchema>;

const AddAssignModal = ({
  isOpen,
  onOpenChange,
  refetch,
  bookingData,
}: AddAssignModalProps) => {
  const user = useAppSelector(selectCurrentUser);

  const { data: vendorData } = useGetVendorProfileQuery(user?.email as string);
  const vendorId = vendorData?.data?._id as string;

  const { data: membersData } = useGetAllMembersQuery({ vendorId });
  const members = membersData?.data || [];

  // TODO: implement mutation
  const [assignToMember] = useBookingAssignedToMemberMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      assignedTo: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Preload form if needed
  useEffect(() => {
    if (bookingData) {
      form.reset({ assignedTo: bookingData.assignedTo || '' });
    }
  }, [bookingData, form]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const toastId = toast.loading('Assigning member...');

    const modifyData = {
      assignedTo: data.assignedTo as string,
    };

    try {
      const res = await assignToMember({
        id: bookingData?._id as string,
        assignedTo: modifyData,
      }).unwrap();
      toast.success(res.message || 'Member assigned successfully');
      form.reset();
      onOpenChange(false);
      refetch?.();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to assign member');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-semibold">Assign Member</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-1 space-y-4"
          >
            {/* Booking Info */}
            <div className="bg-blue-50 p-5 rounded space-y-1 text-sm">
              <p>
                <span className="font-medium">Service:</span>{' '}
                {bookingData?.serviceName}
              </p>
              <p>
                <span className="font-medium">Buyer:</span> {bookingData?.name}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{' '}
                {bookingData?.duration}
              </p>
              <p>
                <span className="font-medium">Payment:</span> Pay{' '}
                {bookingData?.paymentType}
              </p>
              <p>
                <span className="font-medium">Assigned To:</span>{' '}
                {bookingData?.assignedTo || 'Unassigned'}
              </p>
              <p>
                <span className="font-medium">Date:</span> {bookingData?.date}
              </p>
              <p>
                <span className="font-medium">Time:</span> {bookingData?.time}
              </p>
            </div>

            {/* Assign To Select */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Assign To
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-[#f5f5f5] py-6 border-none w-full rounded-sm">
                        <SelectValue placeholder="Please select a member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {members?.map((member) => (
                        <SelectItem key={member._id} value={member.name}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-between items-center gap-2">
              <AppButton
                className="w-1/2 mt-2 text-gray-50 text-base p-5 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
                content={
                  <div className="flex justify-center items-center space-x-2 uppercase">
                    <p>{isSubmitting ? 'Assigning...' : 'Assign'}</p>
                    <ArrowRight />
                  </div>
                }
              />
              <button
                type="button"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className="w-1/2 uppercase flex items-center justify-center text-black p-2 border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80 cursor-pointer text-base mt-2 shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500"
              >
                <p className="mr-1">Cancel</p>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAssignModal;
