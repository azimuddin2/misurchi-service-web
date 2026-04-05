'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  useGetServiceAvailabilityQuery,
  useGetServiceByIdQuery,
} from '@/redux/features/service/serviceApi';
import { TServiceSlots, TSlot } from '@/types/service.type';
import { Button } from '@/components/ui/button';
import { ArrowRight, CalendarDaysIcon, Clock, Trash2 } from 'lucide-react';
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

// ✅ Past slot check helper (Schedule থেকে নেওয়া)
const isSlotPast = (slotTime: string, selectedDate: Date): boolean => {
  const today = new Date();
  const selectedDateStr = selectedDate.toLocaleDateString('en-CA');
  const todayStr = today.toLocaleDateString('en-CA');

  if (selectedDateStr !== todayStr) return false;

  const [startStr] = slotTime.split(' - ');
  const [time, modifier] = startStr.trim().split(' ');
  const [h, m] = time.split(':').map(Number);
  let hours = h + (modifier === 'PM' && h !== 12 ? 12 : 0);
  if (modifier === 'AM' && h === 12) hours = 0;
  const slotMinutes = hours * 60 + (m || 0);
  const currentMinutes = today.getHours() * 60 + today.getMinutes();

  return slotMinutes <= currentMinutes;
};

const RescheduleSet = ({ id }: Props) => {
  const router = useRouter();

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

  // ✅ Fetched date tracker (stale state prevent করতে)
  const fetchedDateRef = useRef<string>('');

  const { data: serviceData } = useGetServiceByIdQuery(getServiceId);
  const serviceId = serviceData?.data?.serviceId;
  const service = serviceData?.data?._id;
  const serviceName = serviceData?.data?.name;

  const formattedDate = selectedDate?.toLocaleDateString('en-CA') || '';
  const formattedSelectedDate = selectedDate
    ? selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // ✅ isFetching ব্যবহার (isLoading এর বদলে)
  const { data, isFetching, error, refetch } = useGetServiceAvailabilityQuery(
    { serviceId: serviceId!, date: formattedDate },
    { skip: !serviceId || !selectedDate },
  );

  useEffect(() => {
    if (serviceId && selectedDate) {
      refetch();
      fetchedDateRef.current = formattedDate;
    }
  }, [serviceId, selectedDate, refetch]);

  // ✅ Date পরিবর্তনে slot ও duration reset
  useEffect(() => {
    setSelectedSlot(null);
    setSelectedDuration(null);
  }, [selectedDate]);

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

      await updateBookingRequest({ id, data: updatedBooking }).unwrap();
      toast.success('Booking updated successfully!');
      router.push('/user/request');
    } catch {
      toast.error('Failed to update booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateChanging = isFetching || fetchedDateRef.current !== formattedDate;

  return (
    <div className="p-3 lg:p-6">
      <h1 className="text-2xl font-medium mb-4">Select a Date & Time Slot</h1>

      {/* Calendar */}
      <div className="mb-8 bg-white w-full shadow p-1 lg:p-5 rounded-lg">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          initialFocus
          showOutsideDays
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          className="w-full hover:bg-none"
          classNames={{
            months:
              'flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1 relative',
            month: 'space-y-4 w-full h-full flex flex-col',
            table: 'w-full h-full border-collapse space-y-1',
            weekdays: 'flex w-full',
            week: 'flex w-full mt-2 h-14 text-xl',
            day: `
              flex-1 h-9 lg:h-12
              rounded p-0 font-normal text-2xl
              flex items-center justify-center
              transition-all duration-200
            `,
          }}
        />
      </div>

      {/* Selected Date Header */}
      {selectedDate && (
        <div className="flex lg:items-center gap-1 lg:gap-2 font-medium text-gray-700 mb-6">
          <CalendarDaysIcon size={24} className="text-green-600" />
          <span className="text-xl">
            Available Service Booking on {formattedSelectedDate}
          </span>
        </div>
      )}

      {error && <p className="text-red-500">Failed to load availability</p>}

      {/* ✅ Loading spinner (Schedule এর মতো) */}
      {isDateChanging ? (
        <div className="flex justify-center items-center py-32">
          <div className="w-10 h-10 border-6 border-[#093954] border-dotted rounded-full animate-spin" />
        </div>
      ) : (
        <div>
          {data?.data.length > 0 ? (
            <>
              {/* Duration Selector */}
              <div className="lg:flex gap-4 mt-6">
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
                      onClick={() => {
                        setSelectedDuration(duration);
                        setSelectedSlot(null);
                      }}
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

              {/* Time Slots Header */}
              <p className="flex items-center gap-2 font-medium text-gray-700 mb-4 mt-8">
                <Clock size={24} className="text-green-600" />
                <span className="text-xl">Available Time Slots</span>
              </p>

              {/* ✅ Legend (Schedule থেকে নেওয়া) */}
              <div className="flex items-center lg:ml-32 gap-3 lg:gap-5 mb-4">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-sm bg-white border border-gray-400" />
                  <p className="text-sm font-medium text-gray-600">Available</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-gray-300" />
                  <p className="text-sm font-medium text-gray-600">Past</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-red-200" />
                  <p className="text-sm font-medium text-red-500">Booked</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-green-100 border-2 border-green-500" />
                  <p className="text-sm font-medium text-green-600">Selected</p>
                </div>
              </div>

              {/* Hint */}
              {!selectedSlot && (
                <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-4 py-2 mb-4 flex items-center gap-2">
                  👆 Please select a time slot below to proceed with
                  rescheduling.
                </p>
              )}

              {/* Slots Grid */}
              {selectedDuration &&
                durationGroups[selectedDuration]?.map((serviceItem) => (
                  <div key={serviceItem.serviceItemId} className="mb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
                      {serviceItem.slots.map((slot: TSlot) => {
                        const isPast = selectedDate
                          ? isSlotPast(slot.time, selectedDate)
                          : false;
                        const isBooked = slot.status === 'booked';
                        const isDisabled = isBooked || isPast;
                        const isSelected =
                          selectedSlot?.serviceItemId ===
                            serviceItem.serviceItemId &&
                          selectedSlot.time === slot.time;

                        return (
                          <Card
                            key={slot.time}
                            title={
                              isPast
                                ? 'This time slot has already passed'
                                : isBooked
                                  ? 'This slot is already booked'
                                  : 'Click to select this slot'
                            }
                            className={`
                              p-4 capitalize rounded transition relative
                              ${isPast ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60' : ''}
                              ${isBooked ? 'bg-red-50 text-red-300 cursor-not-allowed' : ''}
                              ${!isDisabled ? 'bg-white cursor-pointer hover:bg-green-50 hover:border-green-300' : ''}
                              ${isSelected ? 'border-2 border-green-500 bg-green-100' : ''}
                            `}
                            onClick={() => {
                              if (!isDisabled) {
                                setSelectedSlot({
                                  serviceItemId: serviceItem.serviceItemId,
                                  time: slot.time,
                                });
                              }
                            }}
                          >
                            <CardContent className="text-center p-0">
                              <p className="font-medium">{slot.time}</p>
                              {isBooked ? (
                                <p className="text-xs text-red-400 mt-0.5">
                                  Booked
                                </p>
                              ) : isPast ? (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  Past
                                </p>
                              ) : isSelected ? (
                                <p className="text-xs text-green-600 mt-0.5 font-semibold">
                                  ✓ Selected
                                </p>
                              ) : null}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </>
          ) : (
            <div className="mt-20 mb-10">
              <Image
                src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                alt="No results"
                width={100}
                height={100}
                className="mx-auto w-36"
              />
              <p className="text-gray-600 mt-4 text-center text-lg font-medium capitalize">
                Service not available on this day
              </p>
            </div>
          )}
        </div>
      )}

      {/* ✅ Selected Slot Summary (Schedule এর মতো) */}
      {selectedSlot && (
        <div className="mt-6 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Clock className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Selected Appointment
              </p>
              <p className="text-green-800 font-semibold text-base">
                {selectedSlot.time} &nbsp;·&nbsp; {selectedDuration}
              </p>
              <p className="text-sm text-gray-500">{formattedSelectedDate}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedSlot(null)}
            className="text-xs text-red-400 hover:text-red-600 underline"
          >
            <Trash2 size={19} className="cursor-pointer" />
          </button>
        </div>
      )}

      <Button
        disabled={selectedSlot == null || isSubmitting}
        onClick={handleUpdateBooking}
        className="mt-6 w-full border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 text-white p-6 cursor-pointer text-sm shadow-sm rounded-sm border-b-4 border-r-4 shadow-gray-500 flex items-center"
      >
        <span className="uppercase text-sm font-semibold">
          {isSubmitting ? 'Updating...' : 'Confirm Reschedule'}
        </span>
        <ArrowRight />
      </Button>
    </div>
  );
};

export default RescheduleSet;
