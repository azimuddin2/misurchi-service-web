'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { PaymentModal } from './payment-modal';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema } from './bookingValidation';
import { toast } from 'sonner';
import { useAddBookingMutation } from '@/redux/features/booking/bookingApi';
import { useGetServiceByIdQuery } from '@/redux/features/service/serviceApi';
import { useGetUserByIdQuery } from '@/redux/features/user/userApi';
import Spinner from '@/components/shared/Spinner';
import { useEffect } from 'react';

const Booking = () => {
  const user = useAppSelector(selectCurrentUser);
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: userData, isLoading } = useGetUserByIdQuery(
    user?.userId as string,
  );
  const userInfo = userData?.data;

  // ✅ Always provide fallback (never null)
  const serviceId = searchParams.get('serviceId') ?? '';
  const service = searchParams.get('service') ?? '';
  const serviceName = searchParams.get('serviceName') ?? '';
  const serviceItemId = searchParams.get('serviceItemId') ?? '';
  const duration = searchParams.get('duration') ?? '';
  const date = searchParams.get('date') ?? '';
  const time = searchParams.get('slotTime') ?? '';
  const price = Number(searchParams.get('price') ?? 0);

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      serviceName,
      duration,
      price: price.toString(),
      date,
      time,
      paymentType: 'full',
    },
  });

  // ✅ When userInfo loads, update form values dynamically
  useEffect(() => {
    if (userInfo) {
      form.reset({
        name: userInfo.fullName ?? '',
        email: userInfo.email ?? '',
        phone: userInfo.phone ?? '',
        serviceName,
        duration,
        price: price.toString(),
        date,
        time,
        paymentType: 'full',
      });
    }
  }, [userInfo, form, serviceName, duration, price, date, time]);

  const { data } = useGetServiceByIdQuery(service);
  const vendor = data?.data?.vendor?._id;

  const [addBooking] = useAddBookingMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const bookingData = {
      user: user?.userId,
      vendor,
      service,
      serviceId,
      serviceItemId,
      date,
      ...data,
      price: Number(data.price), // ✅ convert when sending
    };

    console.log('Booking Data:', bookingData);

    const toastId = toast.loading('Adding Booking...');

    try {
      const res = await addBooking(bookingData).unwrap();
      toast.success(res.message || 'Booking added successfully');
      router.push(`/booking/${res.data?._id}`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add booking');
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="shadow p-5 lg:p-10 rounded">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* User Info */}
          <div className="space-y-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      {...field}
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="text"
                        placeholder="Enter your phone number"
                        {...field}
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Booking Info */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Service Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      disabled
                      className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Preferred Duration
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        disabled
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        disabled
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Appointment Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        disabled
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="!text-gray-700 !text-base font-medium">
                      Appointment Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        disabled
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Payment Modal Trigger as Submit */}
          <PaymentModal
            price={price}
            onConfirm={(paymentType) => {
              form.handleSubmit((data) => {
                onSubmit({ ...data, paymentType });
              })();
            }}
          />
        </form>
      </Form>
    </div>
  );
};

export default Booking;
