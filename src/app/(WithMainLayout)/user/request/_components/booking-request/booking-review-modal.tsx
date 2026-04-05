'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TBooking } from '@/types/booking.type';
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
import { ArrowRight, StarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAddReviewMutation } from '@/redux/features/review/reviewApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

type Props = {
  selectedBooking: TBooking | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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

const BookingReviewModal = ({
  selectedBooking,
  isOpen,
  onOpenChange,
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
    if (!selectedBooking) return;

    const userId = user?.userId;
    const vendorId = selectedBooking.vendor?._id;
    const serviceId = selectedBooking.service._id; // ✅ THIS MUST BE serviceId, NOT service

    if (!userId || !vendorId || !serviceId) {
      toast.error('Cannot submit review: missing required data.');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a star rating before submitting.');
      return;
    }

    const toastId = toast.loading('Submitting your review...');

    try {
      await addReview({
        user: userId,
        vendor: vendorId,
        service: serviceId,
        rating,
        review: data.review,
      } as any).unwrap();

      toast.success('Your review has been submitted!');
      handleClose();
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
          {/* Service Preview */}
          {selectedBooking && (
            <div className="flex gap-3 bg-gray-50 rounded-lg px-3 py-2 items-center">
              <Image
                src={
                  selectedBooking.service?.images?.[0]?.url ||
                  '/placeholder.png'
                }
                alt={selectedBooking.serviceName || 'Service'}
                width={50}
                height={50}
                className="w-12 h-12 rounded-md object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {selectedBooking.serviceName || 'Service name unavailable'}
                </p>
                <p className="text-xs text-gray-400">
                  Provider:{' '}
                  {selectedBooking.vendor?.businessName || 'Vendor unavailable'}
                </p>
                <p className="text-xs text-gray-400">
                  Date: {selectedBooking.date} · Time: {selectedBooking.time}
                </p>
              </div>
            </div>
          )}

          {/* Review Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Star Rating */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center gap-2">
                <p className="text-sm font-medium text-gray-600">
                  How would you rate this service?
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
                          placeholder="Share your experience with this service..."
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
                  className="flex-1 h-12 rounded-sm border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !user?.userId ||
                    !selectedBooking?.vendor?._id ||
                    !selectedBooking?.serviceId ||
                    rating === 0 ||
                    isSubmitting
                  }
                  className="flex-1 h-12 rounded-sm text-sm font-semibold text-white bg-gradient-to-t to-green-800 from-green-500/70 border-b-4 border-r-4 border-gray-900 shadow-sm shadow-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      Submit Review
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingReviewModal;
