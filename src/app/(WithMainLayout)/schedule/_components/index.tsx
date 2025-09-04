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
import { ArrowRight } from 'lucide-react';
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

  const { data: serviceData } = useGetServiceByIdQuery(id);
  const serviceId = serviceData?.data?.serviceId;
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
      serviceName,
      serviceItemId: selectedSlot.serviceItemId,
      duration: selectedDuration,
      slotTime: selectedSlot.time,
      date: formattedDate,
      price: price.toString(),
    };

    toast.success('Proceeding to checkout...');

    // Navigate to booking page with query params
    const queryString = new URLSearchParams(
      bookingData as Record<string, string>,
    ).toString();
    router.push(`/booking?${queryString}`);
    setIsSubmitting(false);
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-4">Select a Date & Time Slot</h1>

      {/* Calendar */}
      <div className="mb-6 bg-white w-full lg:max-w-sm">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          initialFocus
          showOutsideDays
          classNames={{
            day: 'flex-1 aspect-square flex items-center justify-center rounded-md text-xs font-medium transition-all duration-200 hover:bg-green-100 cursor-pointer p-0 m-0',
            head_cell:
              'flex-1 text-center text-gray-500 font-semibold text-base h-10 flex items-center justify-center',
            row: 'flex w-full mt-1',
            cell: 'flex-1 flex items-center justify-center',
            caption: 'text-center font-bold text-lg mb-4',
            nav_button: 'px-3 py-1 rounded-md hover:bg-green-100 transition',
          }}
          modifiersClassNames={{
            // selected: '!bg-green-600 !text-white !rounded-md !shadow-md',
            today: '!border-2 !border-green-600 !rounded-full !font-bold',
          }}
          className="w-full"
        />
      </div>

      {/* Error */}
      {error && <p className="text-red-500">Failed to load availability</p>}

      {/* Duration selector */}
      <div className="lg:flex gap-4 mt-12">
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

      {/* Slots for selected duration */}
      {selectedDuration &&
        durationGroups[selectedDuration]?.map((serviceItem) => (
          <div key={serviceItem.serviceItemId} className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 my-8">
              {serviceItem.slots.map((slot: TSlot) => (
                <Card
                  key={slot.time}
                  className={`p-4 capitalize rounded ${
                    selectedSlot?.serviceItemId === serviceItem.serviceItemId &&
                    selectedSlot.time === slot.time
                      ? 'border-2 border-green-500'
                      : ''
                  } ${slot.status !== 'available' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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

      {/* No slots message */}
      {selectedDuration && durationGroups[selectedDuration]?.length === 0 && (
        <p className="text-gray-500 mt-4">
          No slots available for this duration.
        </p>
      )}

      {/* Selected Slot */}
      {selectedSlot && (
        <div className="mt-4 p-4 border rounded bg-blue-50 text-blue-800">
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
