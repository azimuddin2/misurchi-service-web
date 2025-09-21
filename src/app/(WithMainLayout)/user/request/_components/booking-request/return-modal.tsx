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
import { CheckCircle } from 'lucide-react';
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
  const [accept, setAccept] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreview, setImagePreview] = useState<string[] | []>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(cancellationSchema),
    defaultValues: {
      reason: '',
    },
  });

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center font-semibold text-xl">
            Return Policy
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              <span className="text-base font-medium">Returns:</span>
              <div className="mt-2 space-y-1">
                <span className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  Returns accepted within 7 days of delivery.
                </span>
                <span className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-green-500 mr-2" />A 20%
                  restocking fee will apply.
                </span>
                <span className="flex items-center text-sm">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  Items must be in original condition and unused.
                </span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
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

            <div className="flex items-center  space-x-2 mt-6">
              <Checkbox
                onClick={() => setAccept((prev) => !prev)}
                id="terms"
                className="cursor-pointer"
              />
              <FormLabel className="text-sm" htmlFor="terms">
                I agree to the cancellation and return policies.
              </FormLabel>
            </div>

            <div className="flex justify-between gap-2">
              <Button
                type="button"
                className="w-1/2 border-gray-800 bg-gradient-to-t to-white from-white hover:bg-green-500/80 p-5 cursor-pointer text-base shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 text-black"
                onClick={() => onOpenChange(false)}
              >
                No
              </Button>
              <Button
                disabled={accept === false}
                type="submit"
                className="w-1/2 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-5 cursor-pointer text-base shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500"
              >
                Yes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnModal;
