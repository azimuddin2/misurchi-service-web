'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  useGetServiceAvailabilityQuery,
  useGetServiceByIdQuery,
} from '@/redux/features/service/serviceApi';
import { TService } from '@/types/service.type';

type Props = {
  id: string;
};

const Schedule = ({ id }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{
    serviceItemId: string;
    time: string;
  } | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);

  const { data: serviceData } = useGetServiceByIdQuery(id);
  const service: TService | undefined = serviceData?.data;
  const serviceId = service?.serviceId;

  const date = selectedDate.toISOString().split('T')[0];

  const { data, isLoading, error, refetch } = useGetServiceAvailabilityQuery(
    { serviceId: serviceId!, date },
    { skip: !serviceId || !selectedDate },
  );

  useEffect(() => {
    if (serviceId && selectedDate) refetch();
  }, [serviceId, selectedDate, refetch]);

  // Group services by duration
  const durationGroups =
    data?.data?.reduce(
      (acc: Record<string, any[]>, serviceItem: any) => {
        if (!acc[serviceItem.duration]) acc[serviceItem.duration] = [];
        acc[serviceItem.duration].push(serviceItem);
        return acc;
      },
      {} as Record<string, any[]>,
    ) || {};

  // Default duration selection
  useEffect(() => {
    if (!selectedDuration && Object.keys(durationGroups).length > 0) {
      setSelectedDuration(Object.keys(durationGroups)[0]);
    }
  }, [durationGroups, selectedDuration]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Select a Date & Time Slot</h1>

      {/* Calendar */}

      <div className="mb-6 mx-auto bg-white shadow rounded-xl p-6 w-full max-w-2xl">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          initialFocus
          showOutsideDays={true}
          modifiersClassNames={{
            selected:
              'bg-green-600 text-white font-semibold shadow-lg rounded-full',
            today: 'border-2 border-green-600 font-semibold rounded-full',
          }}
          classNames={{
            day: 'flex-1 aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 hover:bg-green-100 cursor-pointer',
            head_cell:
              'flex-1 text-center text-gray-500 font-semibold text-sm h-10 flex items-center justify-center',
            row: 'flex w-full mt-1',
            cell: 'flex-1 flex items-center justify-center',
            caption: 'text-center font-bold text-lg mb-4',
            nav_button: 'px-3 py-1 rounded-md hover:bg-green-100 transition',
          }}
          className="w-full" // 👈 Add fixed height here
        />
      </div>

      {/* Loading/Error */}
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Failed to load availability</p>}

      {/* Duration selector (cards instead of tabs) */}
      <div className="flex gap-4 mb-6">
        {Object.entries(durationGroups).map(([duration, services]) => {
          const price = services[0]?.finalPrice;
          return (
            <Card
              key={duration}
              className={`flex-1 cursor-pointer transition ${
                selectedDuration === duration
                  ? 'bg-gradient-to-t to-green-800 from-green-500/70 text-white shadow-lg'
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
            <h2 className="text-lg font-semibold mb-2">
              {serviceItem.name} — {serviceItem.duration} ($
              {serviceItem.finalPrice})
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {serviceItem.slots.map((slot: any) => (
                <Card
                  key={slot.time}
                  className={`p-4 cursor-pointer ${
                    selectedSlot?.serviceItemId === serviceItem.serviceItemId &&
                    selectedSlot.time === slot.time
                      ? 'border-2 border-blue-500'
                      : ''
                  } ${slot.status !== 'available' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() =>
                    slot.status === 'available' &&
                    setSelectedSlot({
                      serviceItemId: serviceItem.serviceItemId,
                      time: slot.time,
                    })
                  }
                >
                  <CardContent>
                    <p>{slot.time}</p>
                    <p>Status: {slot.status}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

      {/* Selected Slot */}
      {selectedSlot && (
        <div className="mt-4 p-4 border rounded bg-blue-50 text-blue-800">
          Selected: {selectedSlot.time} (Service ID:{' '}
          {selectedSlot.serviceItemId})
        </div>
      )}
    </div>
  );
};

export default Schedule;
