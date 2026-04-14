'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { AppButton } from '@/components/shared/app-button';
import { toast } from 'sonner';

import Spinner from '@/components/shared/Spinner';
import { TextEditor } from '@/components/ui/core/text-editor';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useGetVendorProfileQuery } from '@/redux/features/vendor/vendorApi';
import {
  useAddCancellationPolicyMutation,
  useGetCancellationPolicyQuery,
} from '@/redux/features/cancellationPolicy/cancellationPolicyApi';

// -------------------- Validation Schema --------------------
const cancellationPolicySchema = z.object({
  content: z.string({
    required_error: 'Cancellation policy content is required',
  }),
});

const CancellationPolicyForm = () => {
  const user = useAppSelector(selectCurrentUser);

  const form = useForm({
    resolver: zodResolver(cancellationPolicySchema),
    defaultValues: { content: '' },
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { data } = useGetVendorProfileQuery(user?.email as string);
  const vendor = data?.data;

  // Fetch existing About Us content
  const { data: cancellationData, isLoading } = useGetCancellationPolicyQuery(
    vendor?._id as string,
  );

  useEffect(() => {
    if (cancellationData?.data?.content) {
      setValue('content', cancellationData.data.content);
    }
  }, [cancellationData, setValue]);

  const [AddCancellationPolicy] = useAddCancellationPolicyMutation();

  // -------------------- Submit --------------------
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading('Saving cancellation policy...');
    try {
      const res = await AddCancellationPolicy({
        ...data,
        vendor: vendor?._id,
      }).unwrap();
      toast.success(res.message || 'Cancellation policy saved successfully');
    } catch {
      toast.error('Failed to save cancellation policy');
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="rounded max-w-7xl ">
      <h2 className="text-xl font-medium mb-3 ml-1">Cancellation Policy</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Reusable Text Editor */}

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <TextEditor
                  {...field}
                  // value={field.value }
                  name="content"
                  control={control}
                  placeholder="Enter cancellation policy here..."
                  minHeight={500}
                />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <AppButton
            disabled={isSubmitting}
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 m-0"
            content={
              <div className="flex justify-center items-center space-x-2 font-semibold">
                <p className="uppercase">
                  {isSubmitting ? 'Saving...' : 'Save Change'}
                </p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </Form>
    </div>
  );
};

export default CancellationPolicyForm;
