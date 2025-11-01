'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  useGetServiceAvailabilityQuery,
  useGetServiceByIdQuery,
} from '@/redux/features/service/serviceApi';
import { TServiceSlots, TSlot } from '@/types/service.type';
import Spinner from '@/components/shared/Spinner';
import { Button } from '@/components/ui/button';
import { CalendarDaysIcon, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import {
  useGetBookingByIdQuery,
  useUpdateBookingRequestMutation,
} from '@/redux/features/booking/bookingApi';
import { TBooking } from '@/types/booking.type';

type Props = {
  id: string;
};

const RescheduleSet = ({ id }: Props) => {
  const router = useRouter();

  // Fetch existing booking data
  const { data: bookingData } = useGetBookingByIdQuery(id);

  const getServiceId = bookingData?.data?.service._id as string;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedSlot, setSelectedSlot] = useState<{
    serviceItemId: string;
    time: string;
  } | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(
    bookingData?.data?.duration || null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: serviceData } = useGetServiceByIdQuery(getServiceId);
  const serviceId = serviceData?.data?.serviceId;
  const service = serviceData?.data?._id;
  const serviceName = serviceData?.data?.name;

  const formattedDate = selectedDate?.toLocaleDateString('en-CA') || '';

  const { data, isLoading, error, refetch } = useGetServiceAvailabilityQuery(
    { serviceId: serviceId!, date: formattedDate },
    { skip: !serviceId || !selectedDate },
  );

  useEffect(() => {
    if (serviceId && selectedDate) refetch();
  }, [serviceId, selectedDate, refetch]);

  const durationGroups: Record<string, TServiceSlots[]> = useMemo(() => {
    return (
      data?.data?.reduce(
        (acc: Record<string, TServiceSlots[]>, serviceItem: TServiceSlots) => {
          if (!acc[serviceItem.duration]) acc[serviceItem.duration] = [];
          acc[serviceItem.duration].push(serviceItem);
          return acc;
        },
        {},
      ) || {}
    );
  }, [data]);

  useEffect(() => {
    if (!selectedDuration && Object.keys(durationGroups).length > 0) {
      setSelectedDuration(Object.keys(durationGroups)[0]);
    }
  }, [durationGroups, selectedDuration]);

  // Update booking mutation
  const [updateBookingRequest] = useUpdateBookingRequestMutation();

  const handleUpdateBooking = async () => {
    if (
      !selectedSlot ||
      !selectedDuration ||
      !selectedDate ||
      !serviceId ||
      !service ||
      !serviceName
    ) {
      toast.error('Please select a slot and duration before updating!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get price from selected duration and slot
      const price =
        durationGroups[selectedDuration].find(
          (s) => s.serviceItemId === selectedSlot.serviceItemId,
        )?.finalPrice ?? '0';

      const updatedBooking: Partial<TBooking> = {
        serviceItemId: selectedSlot.serviceItemId,
        date: formattedDate,
        time: selectedSlot.time,
        duration: selectedDuration,
        price: Number(price),
        request: {
          type: 'reschedule',
          newDate: formattedDate,
          newTime: selectedSlot.time,
        },
      };

      console.log(updatedBooking);
      // Call API to update booking
      await updateBookingRequest({ id, data: updatedBooking }).unwrap();
      router.push('/user/request');

      toast.success('Booking updated successfully!');
    } catch (error) {
      toast.error('Failed to update booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="p-3 lg:p-6">
      <h1 className="text-2xl font-medium mb-4">Select a Date & Time Slot</h1>

      {/* Calendar */}
      <div className="mb-6 bg-white w-full shadow p-1 lg:p-5 rounded-lg">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          initialFocus
          showOutsideDays
          className="w-full hover:bg-none"
          classNames={{
            months:
              'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1',
            month: 'space-y-4 w-full h-full flex flex-col',
            table: 'w-full h-full border-collapse space-y-1',
            head_row: 'flex w-full',
            row: 'flex w-full mt-2 h-14 text-xl',
            day: `
      flex-1 h-9 lg:h-12 
      rounded p-0 font-normal text-2xl 
      flex items-center justify-center 
      transition-all duration-200 
     
    `,
          }}
        />
      </div>

      {selectedDate && (
        <div className="flex lg:items-center gap-2 text-lg font-medium text-gray-700 mb-6">
          <CalendarDaysIcon className="text-green-600 w-6 h-6" />
          <span>
            Available Service Booking on{' '}
            {selectedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      )}

      {error && <p className="text-red-500">Failed to load availability</p>}

      {data?.data.length > 0 ? (
        <>
          <div className="lg:flex gap-4 mt-8">
            {Object.entries(durationGroups).map(([duration, services]) => {
              const price = services[0]?.finalPrice;
              return (
                <Card
                  key={duration}
                  className={`flex-1 cursor-pointer rounded-lg transition mb-3 lg:mb-0 ${
                    selectedDuration === duration
                      ? 'bg-gradient-to-t to-green-800 from-green-500/70 text-white shadow'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDuration(duration)}
                >
                  <CardContent className="text-center">
                    <p className="text-2xl font-medium mb-1">{duration}</p>
                    <p
                      className={
                        selectedDuration === duration
                          ? 'text-white text-lg'
                          : 'text-gray-600 text-lg'
                      }
                    >
                      ${price}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-4 mt-8">
            <Clock size={20} className="text-green-600" />
            Available Time Slots
          </p>

          {selectedDuration &&
            durationGroups[selectedDuration]?.map((serviceItem) => (
              <div key={serviceItem.serviceItemId} className="mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                  {serviceItem.slots.map((slot: TSlot) => (
                    <Card
                      key={slot.time}
                      className={`p-4 capitalize rounded transition ${
                        slot.status === 'booked'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white cursor-pointer hover:bg-green-50'
                      } ${
                        selectedSlot?.serviceItemId ===
                          serviceItem.serviceItemId &&
                        selectedSlot.time === slot.time
                          ? 'border-2 border-green-500 bg-green-100'
                          : ''
                      }`}
                      onClick={() =>
                        slot.status === 'available' &&
                        setSelectedSlot({
                          serviceItemId: serviceItem.serviceItemId,
                          time: slot.time,
                        })
                      }
                    >
                      <CardContent className="text-center">
                        <p>{slot.time}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
        </>
      ) : (
        <div>
          <p className="text-gray-500 mt-4 text-center capitalize">
            Service not available on this day
          </p>
          <Image
            src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            alt="No results"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>
      )}

      {selectedSlot && (
        <div className="mt-4 p-4 border-l-4 border-green-500 rounded bg-green-50 text-green-800 font-medium">
          Selected: {selectedSlot.time} (Service ID:{' '}
          {selectedSlot.serviceItemId})
        </div>
      )}

      <Button
        disabled={selectedSlot == null || isSubmitting}
        onClick={handleUpdateBooking}
        className="mt-6 w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-6 cursor-pointer text-sm shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500"
      >
        {isSubmitting ? 'Updating...' : 'Update Booking'}
      </Button>
    </div>
  );
};

export default RescheduleSet;
