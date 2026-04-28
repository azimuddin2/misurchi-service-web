'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import {
  useGetUserProfileQuery,
  useUpdateNotificationSettingsMutation,
} from '@/redux/features/user/userApi';

type NotificationFormValues = {
  enableNotification: boolean;
};

const Notifications = () => {
  const user = useAppSelector(selectCurrentUser);
  const email = user?.vendorEmail as string;

  const [updateNotificationSettings] = useUpdateNotificationSettingsMutation();

  const { data: userData } = useGetUserProfileQuery(email as string);

  const form = useForm<NotificationFormValues>({
    defaultValues: {
      enableNotification: true,
    },
  });

  useEffect(() => {
    if (userData?.data?.notifications !== undefined) {
      form.reset({
        enableNotification: userData.data.notifications,
      });
    }
  }, [userData, form]);

  const handleToggle = async (checked: boolean) => {
    form.setValue('enableNotification', checked);

    const toastId = toast.loading('Updating notifications...');

    try {
      await updateNotificationSettings({
        notifications: checked,
      }).unwrap();

      toast.success(
        checked
          ? 'Notifications enabled successfully!'
          : 'Notifications disabled successfully!',
      );
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong');
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="my-6">
      {/* Notifications */}
      <div>
        <h1 className="text-2xl font-semibold py-2">Notifications</h1>

        <Form {...form}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="enableNotification"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg p-4 shadow bg-white">
                  <FormLabel className="text-base font-medium text-gray-800">
                    Enable Notifications
                  </FormLabel>

                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={handleToggle}
                      className=" cursor-pointer
                        data-[state=checked]:bg-gradient-to-r
                        data-[state=checked]:from-green-600
                        data-[state=checked]:to-green-800
                        data-[state=checked]:border-green-700
                      "
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </div>

      {/* Feedback Log History */}
      <div className="flex flex-col sm:flex-row items-center justify-between rounded-lg p-4 shadow mt-5 bg-white">
        <h2 className="text-base font-medium text-gray-800">
          Feedback Log History
        </h2>

        <Link
          href={`/vendor/feedback-history`}
          className="mt-2 sm:mt-0 text-[#0078BF] border-b border-[#0078BF] hover:text-blue-600 transition-colors"
        >
          Go to Feedback
        </Link>
      </div>
    </div>
  );
};

export default Notifications;
