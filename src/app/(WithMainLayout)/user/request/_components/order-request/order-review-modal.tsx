'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TOrder } from '@/types/order.type';
import { useState } from 'react';
import StarRatings from 'react-star-ratings';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { StarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAddReviewMutation } from '@/redux/features/review/reviewApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

type Props = {
  selectedOrder: TOrder | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => void;
};

const reviewSchema = z.object({
  review: z
    .string({ required_error: 'Review message is required' })
    .min(12, 'Review must be at least 12 characters long'),
});

const ratingLabels: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

const OrderReviewModal = ({
  selectedOrder,
  isOpen,
  onOpenChange,
  refetch,
}: Props) => {
  const user = useAppSelector(selectCurrentUser);
  const [rating, setRating] = useState<number>(0);
  const [addReview] = useAddReviewMutation();

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { review: '' },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const handleClose = () => {
    form.reset({ review: '' });
    setRating(0);
    onOpenChange(false);
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!selectedOrder) return;

    if (rating === 0) {
      toast.error('Please select a star rating before submitting.');
      return;
    }

    const toastId = toast.loading('Submitting your review...');

    try {
      await addReview({
        user: user?.userId,
        vendor: selectedOrder.vendor?._id,
        product: selectedOrder.products[0].product,
        rating,
        review: data.review,
        orderId: selectedOrder._id,
      } as any).unwrap();

      toast.success('Your review has been submitted!');

      setTimeout(() => {
        handleClose();
        refetch();
      }, 500);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit review');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Write a Review
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Share your experience to help other customers
          </p>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Ordered Products Preview */}
          {selectedOrder && selectedOrder.products.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Reviewing
              </p>
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto pr-1">
                {selectedOrder.products.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <Image
                      src={product.image || '/placeholder.png'}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-md object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Qty: {product.quantity} · ${product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Star Rating */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-gray-600">
                  How would you rate this product?
                </p>
                <StarRatings
                  rating={rating}
                  starRatedColor="#E8B006"
                  name="rating"
                  starSpacing="4px"
                  changeRating={(newRating: number) => setRating(newRating)}
                  starDimension="36px"
                  starHoverColor="#E8B006"
                />
                <div className="h-5">
                  {rating > 0 ? (
                    <span className="text-sm font-semibold text-amber-500">
                      {ratingLabels[rating]}
                    </span>
                  ) : (
                    <span className="text-xs text-red-400 flex items-center gap-1">
                      <StarIcon className="w-3 h-3" />
                      Please select a rating
                    </span>
                  )}
                </div>
              </div>

              {/* Review Text */}
              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-sm font-medium">
                      Your Review
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <textarea
                          {...field}
                          rows={4}
                          maxLength={500}
                          className="bg-white py-3 px-4 border border-gray-200 rounded-sm w-full resize-none focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm text-gray-700 placeholder:text-gray-400 transition"
                          placeholder="Share your experience with this product..."
                        />
                        <span className="absolute bottom-2 right-3 text-xs text-gray-400">
                          {field.value?.length || 0}/500
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 h-12 uppercase rounded-sm border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!user?.userId || rating === 0 || isSubmitting}
                  className="flex-1 h-12 uppercase rounded-sm text-sm font-medium text-white bg-gradient-to-t to-green-800 from-green-500/70 border-b-4 border-r-4 border-gray-900 shadow-sm shadow-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Submitting...' : <>Submit Review</>}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderReviewModal;
