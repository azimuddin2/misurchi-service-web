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
import { ArrowRight, CalendarDaysIcon, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  id: string;
};

const Schedule = ({ id }: Props) => {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedSlot, setSelectedSlot] = useState<{
    serviceItemId: string;
    time: string;
  } | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedSelectedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const { data: serviceData } = useGetServiceByIdQuery(id);
  const serviceId = serviceData?.data?.serviceId;
  const service = serviceData?.data?._id;
  const serviceName = serviceData?.data?.name;

  // Format date in local timezone as YYYY-MM-DD
  const formattedDate = selectedDate?.toLocaleDateString('en-CA') || '';

  const { data, isLoading, error, refetch } = useGetServiceAvailabilityQuery(
    { serviceId: serviceId!, date: formattedDate },
    { skip: !serviceId || !selectedDate },
  );

  // Refetch when serviceId or selectedDate changes
  useEffect(() => {
    if (serviceId && selectedDate) refetch();
  }, [serviceId, selectedDate, refetch]);

  // Group services by duration
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

  // Default duration selection
  useEffect(() => {
    if (!selectedDuration && Object.keys(durationGroups).length > 0) {
      setSelectedDuration(Object.keys(durationGroups)[0]);
    }
  }, [durationGroups, selectedDuration]);

  const handleProceed = () => {
    if (
      !selectedSlot ||
      !selectedDuration ||
      !selectedDate ||
      !serviceId ||
      !service ||
      !serviceName
    ) {
      toast.error('Please select a slot and duration before proceeding!');
      return;
    }

    setIsSubmitting(true);

    const price =
      durationGroups[selectedDuration].find(
        (s) => s.serviceItemId === selectedSlot.serviceItemId,
      )?.finalPrice ?? '0';

    const bookingData = {
      serviceId,
      service,
      serviceName,
      serviceItemId: selectedSlot.serviceItemId,
      duration: selectedDuration,
      slotTime: selectedSlot.time,
      date: formattedDate,
      price: price.toString(),
    };

    // toast.success('Proceeding to checkout...');

    // Navigate to booking page with query params
    const queryString = new URLSearchParams(
      bookingData as Record<string, string>,
    ).toString();
    router.push(`/booking?${queryString}`);
    setIsSubmitting(false);
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

      {/* Selected Date */}
      {selectedDate && (
        <div className="flex lg:items-center gap-1 lg:gap-2 text-lg font-medium text-gray-700 mb-6">
          <CalendarDaysIcon className="text-green-600 w-6 h-6" />
          <span>Available Service Booking on {formattedSelectedDate}</span>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500">Failed to load availability</p>}

      {/* Duration selector */}
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

      {/* Available Time Slots Header */}
      <p className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-4 mt-8">
        <Clock size={20} className="text-green-600" />
        Available Time Slots
      </p>

      {/* Slots for selected duration */}
      {selectedDuration &&
        durationGroups[selectedDuration]?.map((serviceItem) => (
          <div key={serviceItem.serviceItemId} className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
              {serviceItem.slots.map((slot: TSlot) => (
                <Card
                  key={slot.time}
                  className={`
                    p-4 capitalize rounded transition
                    ${slot.status === 'booked' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white cursor-pointer hover:bg-green-50'}
                    ${
                      selectedSlot?.serviceItemId ===
                        serviceItem.serviceItemId &&
                      selectedSlot.time === slot.time
                        ? 'border-2 border-green-500 bg-green-100'
                        : ''
                    }
                  `}
                  onClick={() => {
                    if (slot.status === 'available') {
                      setSelectedSlot({
                        serviceItemId: serviceItem.serviceItemId,
                        time: slot.time,
                      });
                    }
                  }}
                >
                  <CardContent className="text-center">
                    <p>{slot.time}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

      {/* No slots message */}
      {selectedDuration && durationGroups[selectedDuration]?.length === 0 && (
        <p className="text-gray-500 mt-4">
          No slots available for this duration.
        </p>
      )}

      {/* Selected Slot */}
      {selectedSlot && (
        <div className="mt-4 p-4 border-l-4 border-green-500 rounded bg-green-50 text-green-800 font-medium">
          Selected: {selectedSlot.time} (Service ID:{' '}
          {selectedSlot.serviceItemId})
        </div>
      )}

      <Button
        disabled={selectedSlot == null || isSubmitting}
        onClick={handleProceed}
        className="mt-6 w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-6 cursor-pointer text-sm shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500"
      >
        <span className="uppercase text-sm font-semibold">
          {isSubmitting ? 'Processing...' : 'Proceed to Check out'}
        </span>
        <ArrowRight />
      </Button>
    </div>
  );
};

export default Schedule;
