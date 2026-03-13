'use client';

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
import { AppButton } from '@/components/shared/app-button';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useAddReviewMutation } from '@/redux/features/review/reviewApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type Props = {
  vendorId: string;
  serviceId: string;
  refetch: () => any;
};

const reviewSchema = z.object({
  review: z
    .string({ required_error: 'Review message is required' })
    .min(12, 'Review must be at least 12 characters long'),
});

const AddReview = ({ vendorId, serviceId, refetch }: Props) => {
  const user = useAppSelector(selectCurrentUser);
  const [rating, setRating] = useState<number>(0);

  const form = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const {
    formState: { isSubmitting },
  } = form;

  // name comes from StarRatings component, can be string or undefined
  const changeRating = (newRating: number) => {
    setRating(newRating);
  };

  const [addReview] = useAddReviewMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const reviewData: any = {
      user: user?.userId,
      vendor: vendorId,
      service: serviceId,
      rating,
      ...data,
    };

    const toastId = toast.loading('Submitting your review...');

    try {
      const res = await addReview(reviewData).unwrap();
      toast.success(res.message || 'Your review has been added!');
      refetch();

      form.reset({
        review: '',
      });
      setRating(0);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit your review');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="bg-[#f2f9fb] p-6 rounded-lg">
      <h1 className="text-2xl mb-2">Submit Your Review</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Ratting */}
          <StarRatings
            rating={rating}
            starRatedColor="#E8B006"
            name="rating"
            starSpacing="2px"
            changeRating={changeRating}
            starDimension="30px"
            starHoverColor="#E8B006"
          />

          {/* Review Description */}
          <FormField
            control={form.control}
            name="review"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="!text-gray-700 !text-base font-medium lg:mt-5">
                  Write your review
                </FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    rows={6}
                    className="bg-[#ffffff] py-4 px-4 border-none rounded w-full"
                    placeholder="Enter review here..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <AppButton
            disabled={!user?.userId}
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 mt-5"
            content={
              <div className="flex justify-center items-center space-x-2 font-semibold">
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

export default AddReview;
