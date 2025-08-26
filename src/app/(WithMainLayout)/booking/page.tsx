'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define types based on the provided schema
type TServicePricing = {
  id: string;
  duration: string;
  price: string;
  discount: string;
  finalPrice: string;
};

type TWeekDay =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

type TDaySchedule = {
  enabled: boolean;
  startTime: string;
  endTime: string;
  seats: number;
};

type THolidaySchedule = {
  date: string;
  startTime: string;
  endTime: string;
  seats: number;
};

type TService = {
  name: string;
  savedServices: TServicePricing[];
  availability: {
    weeklySchedule: Partial<Record<TWeekDay, TDaySchedule>>;
    holidays?: THolidaySchedule[];
  };
};

const ServiceBooking = () => {
  // Mock data based on the provided content
  const serviceData: TService = {
    name: 'Consultation Service',
    savedServices: [
      {
        id: '1',
        duration: '45 minutes',
        price: '$50.00',
        discount: '$0.00',
        finalPrice: '$50.00',
      },
      {
        id: '2',
        duration: '1 hour',
        price: '$70.00',
        discount: '$0.00',
        finalPrice: '$70.00',
      },
      {
        id: '3',
        duration: '2 hours',
        price: '$80.00',
        discount: '$0.00',
        finalPrice: '$80.00',
      },
    ],
    availability: {
      weeklySchedule: {
        monday: {
          enabled: true,
          startTime: '08:00',
          endTime: '20:00',
          seats: 5,
        },
        tuesday: {
          enabled: true,
          startTime: '08:00',
          endTime: '20:00',
          seats: 5,
        },
        wednesday: {
          enabled: true,
          startTime: '08:00',
          endTime: '20:00',
          seats: 5,
        },
        thursday: {
          enabled: true,
          startTime: '08:00',
          endTime: '20:00',
          seats: 5,
        },
        friday: {
          enabled: true,
          startTime: '08:00',
          endTime: '20:00',
          seats: 5,
        },
        saturday: {
          enabled: true,
          startTime: '09:00',
          endTime: '18:00',
          seats: 3,
        },
        sunday: {
          enabled: false,
          startTime: '00:00',
          endTime: '00:00',
          seats: 0,
        },
      },
    },
  };

  // State management
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 4, 15)); // May 15, 2025
  const [selectedService, setSelectedService] =
    useState<TServicePricing | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Calendar navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(
        direction === 'prev' ? prev.getMonth() - 1 : prev.getMonth() + 1,
      );
      return newDate;
    });
  };

  // Generate calendar days for the selected month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    // Days in the month
    const daysInMonth = lastDay.getDate();
    // Starting day of the week (0 = Sunday, 1 = Monday, etc.)
    const startDay = firstDay.getDay();

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = Array.from({ length: startDay }, (_, i) => ({
      day: prevMonthLastDay - startDay + i + 1,
      isCurrentMonth: false,
      isToday: false,
      date: new Date(year, month - 1, prevMonthLastDay - startDay + i + 1),
    }));

    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const date = new Date(year, month, day);
      return {
        day,
        isCurrentMonth: true,
        isToday: date.toDateString() === new Date().toDateString(),
        date,
      };
    });

    // Next month days
    const totalCells = 42; // 6 weeks * 7 days
    const nextMonthDaysCount =
      totalCells - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = Array.from(
      { length: nextMonthDaysCount },
      (_, i) => ({
        day: i + 1,
        isCurrentMonth: false,
        isToday: false,
        date: new Date(year, month + 1, i + 1),
      }),
    );

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Available time slots (from the provided content)
  const timeSlots = [
    '8:00 AM - 9:00 AM',
    '10:00 AM - 11:00 AM',
    '12:00 PM - 6:00 PM',
    '7:00 PM - 12:00 AM',
    '3:00 PM - 8:00 PM',
    '9:00 PM - 4:00 PM',
    '6:00 PM - 10:00 PM',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          Book Your Service
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Options */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Service Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serviceData.savedServices.map((service) => (
                  <div
                    key={service.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedService?.id === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="font-semibold">{service.duration}</div>
                    <div className="text-lg font-bold text-blue-600">
                      {service.finalPrice}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar & Time Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="capitalize">
                    {selectedDate.toLocaleString('default', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center font-medium text-gray-500 py-2"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {generateCalendarDays().map((day, index) => (
                    <div
                      key={index}
                      className={`p-2 text-center rounded-lg border cursor-pointer ${
                        day.isCurrentMonth
                          ? day.isToday
                            ? 'bg-blue-100 border-blue-500'
                            : 'border-transparent hover:bg-gray-100'
                          : 'text-gray-400'
                      } ${
                        day.date.toDateString() === selectedDate.toDateString()
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : ''
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      {day.day}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`p-3 border rounded-lg cursor-pointer text-center ${
                        selectedTimeSlot === slot
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {slot}
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full mt-6 py-3 text-lg"
                  size="lg"
                  disabled={!selectedService || !selectedTimeSlot}
                >
                  PROCEED TO CHECKOUT →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBooking;
