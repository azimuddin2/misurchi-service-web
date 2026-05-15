'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TOrder } from '@/types/order.type';
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
import MSWImageUploader from '@/components/ui/core/MSWImageUploader';
import ImagePreviewer from '@/components/ui/core/MSWImageUploader/ImagePreviewer';
import { toast } from 'sonner';
import { useRequestOrderMutation } from '@/redux/features/order/orderApi';
import { useGetReturnPolicyQuery } from '@/redux/features/returnPolicy/returnPolicyApi';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { AlertTriangle, ArrowRight, MessageSquare } from 'lucide-react';

interface CancelModalProps {
  selectedOrder: TOrder | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (reason: string) => void;
}

const cancellationSchema = z.object({
  reason: z.string().min(1, 'Return reason is required'),
});

type FormValues = z.infer<typeof cancellationSchema>;

const ReturnModal = ({
  selectedOrder,
  isOpen,
  onOpenChange,
  onConfirm,
}: CancelModalProps) => {
  const router = useRouter();
  const user = useAppSelector(selectCurrentUser);
  const [accept, setAccept] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(cancellationSchema),
    defaultValues: {
      reason: '',
    },
  });

  const { data: returnData } = useGetReturnPolicyQuery(
    selectedOrder?.vendor?._id as string,
  );

  const hasPolicy = !!returnData?.data?.content;

  const [requestOrder] = useRequestOrderMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!selectedOrder?._id) {
      toast.error('No order selected.');
      return;
    }

    // Trigger any parent handler
    onConfirm(data.reason);

    // Prepare form data for backend
    const modifiedData = {
      ...data,
      type: 'return',
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(modifiedData));
    imageFiles.forEach((file) => formData.append('images', file));

    const toastId = toast.loading('Updating order request...');

    try {
      const res = await requestOrder({
        id: selectedOrder._id,
        body: formData,
      }).unwrap();

      toast.success(
        `Your ${modifiedData.type === 'return' ? 'return' : 'cancellation'} request for order #${selectedOrder?._id} has been submitted successfully!`,
      );
    } catch (error: any) {
      const errorMsg =
        error?.data?.message || 'Failed to update order request.';
      toast.error(errorMsg);
    } finally {
      toast.dismiss(toastId);
      onOpenChange(false);
    }
  };

  const handleMessageVendor = () => {
    const vendorUserId = (selectedOrder?.vendor?.userId as any)?._id;

    const productId =
      typeof selectedOrder?.products[0]?.product === 'string'
        ? selectedOrder?.products[0]?.product
        : (selectedOrder?.products[0]?.product as any)?._id;

    router.push(`/user/message?userId=${vendorUserId}&productId=${productId}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-xl">
            Return Policy
          </DialogTitle>
          <DialogDescription asChild>
            {!hasPolicy ? (
              <div className="flex items-start gap-2 text-yellow-600 bg-yellow-50 border border-yellow-200 rounded px-4 py-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <p>
                  This vendor has not set a return policy yet. You may still
                  proceed with your return.
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
                  __html: returnData?.data?.content || '',
                }}
              />
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            {/* Images part */}
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <p className="text-primary font-medium text-base mb-3">
                  Upload Photos for evidence
                </p>
              </div>
              <div className="flex gap-4 ">
                <MSWImageUploader
                  setImageFiles={setImageFiles}
                  setImagePreview={setImagePreview}
                  label="Upload Photos"
                  className="w-full lg:w-fit mt-0"
                />
                <ImagePreviewer
                  className="flex flex-wrap gap-4"
                  setImageFiles={setImageFiles}
                  imagePreview={imagePreview}
                  setImagePreview={setImagePreview}
                />
              </div>
            </div>

            {/* Return Reason*/}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Return Reason
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

            <div className="flex items-center  space-x-2 mt-6 mb-2">
              <Checkbox
                onClick={() => setAccept((prev) => !prev)}
                id="terms"
                className="cursor-pointer"
              />
              <FormLabel className="text-sm" htmlFor="terms">
                I agree to the return policy.
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

export default ReturnModal;
