'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { TBooking } from '@/types/booking.type';
import { useUpdateBookingRequestMutation } from '@/redux/features/booking/bookingApi';
import { useGetCancellationPolicyQuery } from '@/redux/features/cancellationPolicy/cancellationPolicyApi';
import Spinner from '@/components/shared/Spinner';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { AlertTriangle, ArrowRight, MessageSquare } from 'lucide-react';

interface CancelModalProps {
  selectedBooking: TBooking | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (reason: string) => void;
}

const cancellationSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required'),
});

type FormValues = z.infer<typeof cancellationSchema>;

const CancelModal = ({
  selectedBooking,
  isOpen,
  onOpenChange,
  onConfirm,
}: CancelModalProps) => {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const [accept, setAccept] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(cancellationSchema),
    defaultValues: {
      reason: '',
    },
  });

  const { data: cancellationData, isLoading } = useGetCancellationPolicyQuery(
    selectedBooking?.vendor?._id as string,
  );
  const hasPolicy = !!cancellationData?.data?.content;

  const [updateBookingRequest] = useUpdateBookingRequestMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!selectedBooking?._id) {
      toast.error('No order selected.');
      return;
    }

    // Trigger any parent handler (optional)
    onConfirm(data.reason);

    // Prepare request payload
    const modifiedData: Partial<TBooking> = {
      request: {
        type: 'cancel', // or 'reschedule' if needed
        reason: data.reason,
      },
    };

    const toastId = toast.loading('Updating booking request...');

    try {
      // Call the mutation
      await updateBookingRequest({
        id: selectedBooking._id,
        data: modifiedData,
      }).unwrap();

      toast.success(
        `Your cancellation request for order #${selectedBooking._id} has been submitted successfully!`,
      );
      form.reset();
    } catch (error: any) {
      const errorMsg =
        error?.data?.message || 'Failed to update booking request.';
      toast.error(errorMsg);
    } finally {
      toast.dismiss(toastId);
      onOpenChange(false);
    }
  };

  const handleMessageVendor = () => {
    const vendorUserId = (selectedBooking?.vendor?.userId as any)?._id;

    const serviceId = selectedBooking?.service._id;

    router.push(`/user/message?userId=${vendorUserId}&serviceId=${serviceId}`);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-xl">
            Cancellation Policy
          </DialogTitle>
          <DialogDescription asChild>
            {!hasPolicy ? (
              <div className="flex items-start gap-2 text-yellow-600 bg-yellow-50 border border-yellow-200 rounded px-4 py-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <p>
                  This vendor has not set a cancellation policy yet. You may
                  still proceed with your cancellation.
                </p>
              </div>
            ) : (
              <div
                className="mt-2 text-base text-gray-500 prose prose-sm max-w-none
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
                [&_li]:my-0.5
                [&_b]:font-semibold [&_strong]:font-semibold
                [&_a]:text-blue-500 [&_a]:underline
                [&_p]:my-1"
                dangerouslySetInnerHTML={{
                  __html: cancellationData?.data?.content || '',
                }}
              />
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Cancellation Reason
                  </FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={5}
                      placeholder="Enter reason"
                      className="bg-[#f5f5f5] py-3 px-4 border border-gray-300 rounded w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2 mt-6">
              <Checkbox
                onClick={() => setAccept((prev) => !prev)}
                id="terms"
                className="cursor-pointer"
              />
              <FormLabel className="text-sm" htmlFor="terms">
                I agree to cancellation and reschedule policies before
                confirming my service.
              </FormLabel>
            </div>

            <div className="flex justify-between gap-2">
              <Button
                disabled={accept === false}
                type="submit"
                className="w-1/2 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-5 cursor-pointer text-base shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 uppercase"
              >
                Submit <ArrowRight />
              </Button>
              <Button
                type="button"
                className="w-1/2 border-gray-800 bg-gradient-to-t to-white from-white hover:bg-green-500/80 p-5 cursor-pointer text-base shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 text-black uppercase"
                disabled={!user?.userId}
                onClick={handleMessageVendor}
              >
                Message Provider <MessageSquare />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelModal;
