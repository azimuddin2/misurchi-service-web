'use client';

import { useSearchParams } from 'next/navigation';
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

const Booking = () => {
  const user = useAppSelector(selectCurrentUser);
  const searchParams = useSearchParams();

  const serviceId = searchParams.get('serviceId');
  const service = searchParams.get('service');
  const serviceName = searchParams.get('serviceName');
  const duration = searchParams.get('duration');
  const date = searchParams.get('date');
  const time = searchParams.get('slotTime');
  const price = Number(searchParams.get('price')) || 0;

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '', // ✅ must be string
      serviceName: serviceName || '',
      duration: duration || '',
      price: price.toString() || '', // string if your schema expects string
      date: formattedDate || '',
      time: time || '',
      paymentType: 'full',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const modifyData = {
      service,
      ...data,
    };

    console.log('Booking submitted:', modifyData);
    // Send to backend API here...
  };

  return (
    <div className="shadow p-5 lg:p-10 rounded">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* user info part */}
          <div className="space-y-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      {...field} // ✅ this is enough
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
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        value={field.value || user?.email || ''}
                        disabled
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter your phone number"
                        {...field} // ✅ important
                        className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* booking info */}
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="serviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || serviceName || ''}
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
                    <FormLabel>Preferred Duration</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value || duration || ''}
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
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value || price}
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
                    <FormLabel>Appointment Date</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value || formattedDate}
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
                    <FormLabel>Appointment Time</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        value={field.value || time || ''}
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
                // ✅ data will now contain form values
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
