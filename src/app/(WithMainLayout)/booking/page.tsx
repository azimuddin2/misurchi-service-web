'use client';

import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Slot = {
  time: string;
  status: 'available' | 'booked';
};

export default function BookingForm({
  serviceId,
  userId,
}: {
  serviceId: string;
  userId: string;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!date) return;
    const fetchSlots = async () => {
      setLoading(true);
      const res = await fetch(
        `/api/availability?serviceId=${serviceId}&date=${date.toISOString().split('T')[0]}`,
      );
      const data = await res.json();
      setSlots(data.slots || []);
      setLoading(false);
    };
    fetchSlots();
  }, [date, serviceId]);

  // Handle booking
  const handleBooking = async () => {
    if (!date || !selectedTime) return;

    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serviceId,
        userId,
        date: date.toISOString().split('T')[0],
        time: selectedTime,
      }),
    });

    const result = await res.json();
    if (result.success) {
      alert('✅ Booking confirmed!');
      setSelectedTime(null);
      // Refetch slots after booking
      const updated = await fetch(
        `/api/availability?serviceId=${serviceId}&date=${date.toISOString().split('T')[0]}`,
      );
      const updatedData = await updated.json();
      setSlots(updatedData.slots || []);
    } else {
      alert('❌ ' + result.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Calendar Section */}
      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
          />
        </CardContent>
      </Card>

      {/* Time Slots Section */}
      <Card className="shadow-md border rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">
            Available Time Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-center">Loading slots...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant="outline"
                    disabled={slot.status === 'booked'}
                    className={cn(
                      'w-full rounded-xl border transition-all duration-200',
                      slot.status === 'booked' &&
                        'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed',
                      selectedTime === slot.time &&
                        'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
                    )}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))
              ) : (
                <p className="text-gray-500 col-span-3 text-center">
                  No slots available
                </p>
              )}
            </div>
          )}

          {/* Confirm Button */}
          <div className="flex justify-center mt-6">
            <Button
              disabled={!selectedTime}
              onClick={handleBooking}
              className="px-6 py-2 rounded-xl shadow-md bg-green-600 hover:bg-green-700"
            >
              Confirm Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
