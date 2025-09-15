'use client';

import { useRouter } from 'next/navigation';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAddBookingMutation } from '@/redux/features/booking/bookingApi';
import CountryStateCitySelector from './country-state-city-selector';
import { AppButton } from '@/components/shared/app-button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/redux/features/checkout/checkoutSlice';
import { orderSchema } from './orderValidation';

const ShippingAddress = () => {
  const user = useAppSelector(selectCurrentUser);
  const checkoutPayload = useAppSelector((state) => state.checkout);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email,
      phone: '',
      address: '',
      zipCode: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { register, setValue, control } = form;

  const [addBooking] = useAddBookingMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!checkoutPayload) return alert('No order data found!');

    const orderPayload = {
      buyer: user?.userId,
      customerName: data.name,
      customerEmail: user?.email,
      customerPhone: data.phone,
      totalPrice: checkoutPayload.totalPrice,
      vendor: checkoutPayload.vendor,
      products: checkoutPayload.products,
      billingDetails: {
        country: data.country,
        state: data.state,
        city: data.city,
        zipCode: data.zipCode,
        address: data.address,
      },
    };

    console.log('Final Order Payload:', orderPayload);

    // const toastId = toast.loading('Adding Booking...');
    // try {
    //     const res = await addBooking(bookingData).unwrap();
    //     toast.success(res.message || 'Booking added successfully');
    //     router.push(`/booking/${res.data?._id}`);
    // } catch (error: any) {
    //     toast.error(error?.data?.message || 'Failed to add booking');
    // } finally {
    //     toast.dismiss(toastId);
    // }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 sm:p-6">
      <div className="md:col-span-2 space-y-6 shadow p-5 lg:p-10 rounded">
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
                        {...(field || user?.name)}
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

            {/* Country, State, City Selector */}
            <div className="grid w-full  items-center mb-5">
              <CountryStateCitySelector
                control={control}
                setValue={setValue}
                register={register}
              />
            </div>

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem className="lg:mb-0 mb-5">
                  <FormLabel className="!text-gray-700 !text-base font-medium">
                    Zip Code
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Type Zip Code"
                    {...field}
                    value={field.value || ''}
                    className="bg-[#f5f5f5] py-6 border-none rounded-sm"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="!text-gray-700 !text-base font-medium lg:mt-5">
                    Delivery Address
                  </FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      rows={8}
                      className="bg-[#f5f5f5] py-4 px-4 border-none rounded-sm w-full"
                      placeholder="For Example: House# 123, Street# 123, ABC Road"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <AppButton
              className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
              content={
                <div className="flex justify-center items-center space-x-2 font-semibold">
                  <p>{isSubmitting ? 'Place Order...' : 'Place Order'}</p>
                  <ArrowRight />
                </div>
              }
            />
          </form>
        </Form>
      </div>

      <div className="p-4 border rounded-md shadow-sm h-fit">
        <h2 className="text-center text-xl font-medium mb-2">
          Total Order Summary
        </h2>
        <div>
          {checkoutPayload?.products?.map((product: Product) => (
            <div
              key={product.name}
              className=" justify-between mb-3 border p-3 rounded bg-gray-50"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={50}
                height={50}
              />
              <h1 className="font-medium mt-1">{product.name}</h1>
              <h4>Quantity: {product.quantity}</h4>
              <h3>Price: {product.price}</h3>
              <h3>Total Price: {product.price * product.quantity}</h3>
            </div>
          ))}
        </div>
        <div className="text-right">
          <h2 className="font-semiblod text-lg">
            Items: {checkoutPayload.products.length}
          </h2>
          <p className="font-semibold text-xl">
            Final Total Price: ${checkoutPayload.totalPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddress;
