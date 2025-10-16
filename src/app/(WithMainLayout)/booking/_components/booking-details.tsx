'use client';

import { useGetBookingByIdQuery } from '@/redux/features/booking/bookingApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Image from 'next/image';
import Spinner from '@/components/shared/Spinner';
import { useCreateCheckoutSessionMutation } from '@/redux/features/payment/paymentApi';
import { toast } from 'sonner';

type Props = {
  bookingId: string;
};

const BookingDetails = ({ bookingId }: Props) => {
  const { data, isLoading } = useGetBookingByIdQuery(bookingId);
  const booking = data?.data;

  const [createCheckoutSession] = useCreateCheckoutSessionMutation();

  const handleCheckout = async () => {
    try {
      const payload: any = {
        user: booking?.user,
        vendor: booking?.vendor,
        modelType: 'Booking',
        reference: booking?._id,
        price: booking?.price,
      };

      const response = await createCheckoutSession(payload).unwrap();

      if (response.success && response.data) {
        window.location.href = response.data; // redirect to Stripe Checkout
      } else {
        toast.error(response.message || 'Failed to start payment.');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong.');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-destructive">No booking found.</p>
      </div>
    );
  }

  const service = booking.service;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="my-5 p-4 border-l-4 border-green-500 rounded-md bg-green-50 text-green-800">
        <p className="font-semibold">🎉 Booking Successful!</p>
        <p className="text-sm">
          Hi {booking.name}, please complete your payment to confirm your
          booking.
        </p>
      </div>

      <Card className="overflow-hidden shadow-lg border pt-0">
        {/* Images */}
        {service?.images?.length > 0 && (
          <div className="relative w-full h-60">
            <Image
              src={service.images[0].url}
              alt={service.name}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-2 right-2 flex space-x-2">
              {service.images.slice(0, 3).map((img, i) => (
                <div
                  key={img.key}
                  className="relative w-14 h-14 rounded-md overflow-hidden border"
                >
                  <Image
                    src={img.url}
                    alt={`preview ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <CardHeader className="flex flex-col sm:flex-row sm:justify-between">
          <div>
            <CardTitle className="text-xl">{booking.serviceName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Service ID: {booking.serviceId}
            </p>
          </div>
          <Badge
            className="capitalize"
            variant={
              booking.status === 'pending'
                ? 'secondary'
                : booking.status === 'confirmed'
                  ? 'default'
                  : 'destructive'
            }
          >
            {booking.status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Personal Info */}
          <section>
            <h2 className="font-medium mb-2">👤 Your Information</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <InfoItem label="Full Name" value={booking.name} />
              <InfoItem label="Email" value={booking.email} />
              <InfoItem label="Phone" value={booking.phone} />
            </div>
          </section>

          <Separator />

          {/* Booking Info */}
          <section>
            <h2 className="font-medium mb-2">📅 Booking Information</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <InfoItem
                label="Date"
                value={format(new Date(booking.date), 'dd MMM yyyy')}
              />
              <InfoItem label="Time" value={booking.time} />
              <InfoItem label="Duration" value={booking.duration} />
              <InfoItem label="Price" value={`$${booking.price}`} />
            </div>
          </section>

          <Separator />

          {/* Payment Info */}
          <section>
            <h2 className="font-medium mb-2">💳 Payment</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <InfoItem label="Type" value={booking.paymentType} />
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge
                  variant={
                    booking.paymentStatus === 'pending'
                      ? 'secondary'
                      : booking.paymentStatus === 'paid'
                        ? 'default'
                        : 'destructive'
                  }
                  className="capitalize"
                >
                  {booking.paymentStatus}
                </Badge>
              </div>
            </div>

            {booking.paymentStatus === 'pending' && (
              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-1/4 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-5 cursor-pointer mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 text-base"
              >
                Pay Now
              </Button>
            )}
          </section>

          <Separator />

          {/* Service Info */}
          <section>
            <h2 className="font-medium mb-2">💈 Service Information</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {service.description}
            </p>
          </section>

          {/* Meta Info */}
          <p className="text-xs text-muted-foreground pt-4">
            Created on{' '}
            {format(new Date(booking.createdAt), 'dd MMM yyyy, hh:mm a')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingDetails;

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-muted-foreground">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
