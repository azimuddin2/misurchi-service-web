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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { toast } from 'sonner';
import CountryStateCitySelector from './country-state-city-selector';
import { AppButton } from '@/components/shared/app-button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/redux/features/checkout/checkoutSlice';
import { useAddOrderMutation } from '@/redux/features/order/orderApi';
import { clearCart } from '@/redux/features/cart/cartSlice';
import { useGetUserProfileQuery } from '@/redux/features/user/userApi';
import Spinner from '@/components/shared/Spinner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

const orderSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  country: z
    .string({ required_error: 'Country is required' })
    .min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  city: z.string().optional(),
  zipCode: z
    .string({ required_error: 'Zip Code is required' })
    .min(1, { message: 'Zip Code is required' }),
  address: z
    .string({ required_error: 'Delivery address is required' })
    .min(1, { message: 'Delivery address is required' }),
});

const ShippingAddress = () => {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const checkoutPayload = useAppSelector((state) => state.checkout);
  const router = useRouter();

  const { data: userData, isLoading } = useGetUserProfileQuery(
    user?.email as string,
  );

  const form = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      country: '',
      state: '',
      city: '',
      zipCode: '',
      address: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { register, setValue, control } = form;

  useEffect(() => {
    if (userData?.data) {
      setValue('name', userData?.data?.fullName || '');
      setValue('email', userData?.data?.email || '');
      setValue('phone', userData?.data?.phone || '');
    }
  }, [userData, setValue]);

  const [addOrder] = useAddOrderMutation();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!checkoutPayload) return alert('No order data found!');

    const orderPayload = {
      buyer: user?.userId,
      customerName: data.name,
      customerEmail: user?.email,
      customerPhone: userData?.data?.phone || data.phone,
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

    const toastId = toast.loading('Processing your order...');
    try {
      const res = await addOrder(orderPayload).unwrap();
      toast.success(res.message || 'Product order successfully');
      dispatch(clearCart());
      router.push(`/my-orders`);
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
                          disabled
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
                      placeholder="e.g. 123 Main St, Apt 4B, New York, NY 10001"
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
          {checkoutPayload?.products?.map((product: Product, index: number) => (
            <div
              key={index}
              className="justify-between mb-3 border p-3 rounded bg-gray-50"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={50}
                height={50}
              />
              <h1 className="font-medium mt-1">{product.name}</h1>
              {/* Size & Color Design */}
              <div className="flex gap-2 flex-wrap">
                {product.size && (
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded flex items-center gap-1 font-medium">
                    Size: {product.size}
                  </span>
                )}

                {product.color && (
                  <span className="px-2 py-1 text-xs bg-white text-gray-800 rounded flex items-center gap-1 font-medium">
                    Color:
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300 ml-1"
                      style={{ backgroundColor: product.color }}
                    ></span>
                    {product.color}
                  </span>
                )}
              </div>

              <h4 className="mt-1">Quantity: {product.quantity}</h4>
              <h3>Price: ${product.price}</h3>
              <h3>Total Price: ${product.price * product.quantity}</h3>
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
