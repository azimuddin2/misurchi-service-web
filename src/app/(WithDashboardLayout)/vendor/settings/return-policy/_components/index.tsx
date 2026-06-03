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
  useAddReturnPolicyMutation,
  useGetReturnPolicyQuery,
} from '@/redux/features/returnPolicy/returnPolicyApi';

// -------------------- Validation Schema --------------------
const returnPolicySchema = z.object({
  content: z.string({ required_error: 'Return policy content is required' }),
});

const ReturnPolicyForm = () => {
  const user = useAppSelector(selectCurrentUser);

  const form = useForm({
    resolver: zodResolver(returnPolicySchema),
    defaultValues: { content: '' },
  });

  const {
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const { data } = useGetVendorProfileQuery(user?.vendorEmail as string);
  const vendor = data?.data;

  // Fetch existing About Us content
  const { data: returnData, isLoading } = useGetReturnPolicyQuery(
    vendor?._id as string,
  );

  useEffect(() => {
    if (returnData?.data?.content) {
      setValue('content', returnData.data.content);
    }
  }, [returnData, setValue]);

  const [AddReturnPolicy] = useAddReturnPolicyMutation();

  // -------------------- Submit --------------------
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const toastId = toast.loading('Saving return policy...');
    try {
      const res = await AddReturnPolicy({
        ...data,
        vendor: vendor?._id,
      }).unwrap();
      toast.success(res.message || 'Return policy saved successfully');
    } catch {
      toast.error('Failed to save return policy');
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="rounded max-w-7xl ">
      <h2 className="text-xl font-medium mb-3 ml-1">Return Policy</h2>
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
                  control={control as any}
                  placeholder="Enter return policy here..."
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

export default ReturnPolicyForm;
