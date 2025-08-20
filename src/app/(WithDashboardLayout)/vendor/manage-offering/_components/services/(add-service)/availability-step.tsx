'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CalendarIcon,
  Clock,
  Users,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AvailabilityStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

const daysOfWeek = [
  { key: 'sunday', label: 'Sunday' },
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
];

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ✅ Helper to format time into 12-hour with AM/PM
const formatTime = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${String(formattedHours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0',
  )} ${ampm}`;
};

export function AvailabilityStep({
  data,
  onNext,
  onBack,
}: AvailabilityStepProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [customAvailability, setCustomAvailability] = useState<
    Record<string, any>
  >(data?.availability?.customDates || {});

  const [weeklySchedule, setWeeklySchedule] = useState(
    data?.availability?.weeklySchedule || {
      sunday: {
        enabled: false,
        startTime: '09:00',
        endTime: '17:00',
        seats: 15,
      },
      monday: {
        enabled: true,
        startTime: '09:00',
        endTime: '17:00',
        seats: 15,
      },
      tuesday: {
        enabled: true,
        startTime: '09:00',
        endTime: '17:00',
        seats: 15,
      },
      wednesday: {
        enabled: true,
        startTime: '09:00',
        endTime: '17:00',
        seats: 15,
      },
      thursday: {
        enabled: true,
        startTime: '09:00',
        endTime: '17:00',
        seats: 15,
      },
      friday: {
        enabled: true,
        startTime: '09:00',
        endTime: '17:00',
        seats: 15,
      },
      saturday: {
        enabled: false,
        startTime: '09:00',
        endTime: '17:00',
        seats: 15,
      },
    },
  );

  const [holidays, setHolidays] = useState(data?.availability?.holidays || []);
  const [newHoliday, setNewHoliday] = useState({
    date: '',
    startTime: '10:00',
    endTime: '17:00',
    seats: 15,
  });

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateAvailable = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayKey = daysOfWeek[date.getDay()].key;

    // Check if it's a custom date
    if (customAvailability[dateStr]) {
      return customAvailability[dateStr].enabled;
    }

    // Check if it's a holiday
    const isHoliday = holidays.some((h) => h.date === dateStr);
    if (isHoliday) return true;

    // Check weekly schedule
    return weeklySchedule[dayKey].enabled;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setNewHoliday((prev) => ({ ...prev, date: dateStr }));
  };

  const toggleDateAvailability = (dateStr: string) => {
    setCustomAvailability((prev) => ({
      ...prev,
      [dateStr]: {
        enabled: !prev[dateStr]?.enabled,
        startTime: prev[dateStr]?.startTime || '09:00',
        endTime: prev[dateStr]?.endTime || '17:00',
        seats: prev[dateStr]?.seats || 15,
      },
    }));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const isAvailable = isDateAvailable(dateStr);
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === new Date().toISOString().split('T')[0];

      days.push(
        <motion.button
          key={day}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleDateClick(dateStr)}
          onDoubleClick={() => toggleDateAvailability(dateStr)}
          className={`
            h-10 w-10 rounded-lg text-sm font-medium transition-all duration-200
            ${isSelected ? 'bg-gradient-to-t to-green-800 from-green-600/70 text-white shadow-lg' : ''}
            ${isToday && !isSelected ? 'bg-blue-100 text-blue-600 border border-blue-300' : ''}
            ${isAvailable && !isSelected && !isToday ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}
            ${!isAvailable && !isSelected && !isToday ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' : ''}
            ${!isSelected && !isToday && !isAvailable ? 'opacity-50' : ''}
          `}
          title={`${dateStr} - ${isAvailable ? 'Available' : 'Unavailable'} (Double-click to toggle)`}
        >
          {day}
        </motion.button>,
      );
    }

    return days;
  };

  const updateSchedule = (day: string, field: string, value: any) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const addHoliday = () => {
    if (newHoliday.date) {
      setHolidays((prev) => [...prev, { ...newHoliday, id: Date.now() }]);
      setNewHoliday({
        date: '',
        startTime: '10:00',
        endTime: '17:00',
        seats: 15,
      });
    }
  };

  const removeHoliday = (index: number) => {
    setHolidays((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onNext({
      availability: {
        weeklySchedule,
        holidays,
      },
    });
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-green-600" />
            Availability Calendar
          </CardTitle>
          <p className="text-sm text-gray-600">
            Click to select dates, double-click to toggle availability. Green
            dates are available, gray are unavailable.
          </p>
        </CardHeader>
        <CardContent>
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <h3 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map((day) => (
              <div
                key={day}
                className="h-10 flex items-center justify-center text-sm font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded"></div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-green-600" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {daysOfWeek.map((day, index) => (
            <motion.div
              key={day.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${
                weeklySchedule[day.key].enabled
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 min-w-32">
                <Switch
                  checked={weeklySchedule[day.key].enabled}
                  onCheckedChange={(checked) =>
                    updateSchedule(day.key, 'enabled', checked)
                  }
                />
                <Label className="font-medium">{day.label}</Label>
              </div>

              {weeklySchedule[day.key].enabled ? (
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <Input
                      type="time"
                      value={weeklySchedule[day.key].startTime}
                      onChange={(e) =>
                        updateSchedule(day.key, 'startTime', e.target.value)
                      }
                      className="w-32"
                    />
                    <span className="text-gray-500">to</span>
                    <Input
                      type="time"
                      value={weeklySchedule[day.key].endTime}
                      onChange={(e) =>
                        updateSchedule(day.key, 'endTime', e.target.value)
                      }
                      className="w-32"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <Input
                      type="number"
                      value={weeklySchedule[day.key].seats}
                      onChange={(e) =>
                        updateSchedule(
                          day.key,
                          'seats',
                          Number.parseInt(e.target.value),
                        )
                      }
                      className="w-20"
                      min="1"
                    />
                    <span className="text-sm text-gray-500">seats</span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500 italic">Closed</span>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Holiday Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-green-600" />
            Holiday Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Holiday */}
          <div className="grid grid-cols-1 gap-4 p-3 lg:p-5 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm">Date</Label>
              <Input
                className="bg-[#ffffff] py-5 border-none w-full rounded-sm"
                type="date"
                value={newHoliday.date}
                onChange={(e) =>
                  setNewHoliday((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Start Time</Label>
                <Input
                  className="bg-[#ffffff] py-5 border-none w-full rounded-sm"
                  type="time"
                  value={newHoliday.startTime}
                  onChange={(e) =>
                    setNewHoliday((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm">End Time</Label>
                <Input
                  className="bg-[#ffffff] py-5 border-none w-full rounded-sm"
                  type="time"
                  value={newHoliday.endTime}
                  onChange={(e) =>
                    setNewHoliday((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div>
              <Label className="text-sm">Seats</Label>
              <Input
                className="bg-[#ffffff] py-5 border-none w-full rounded-sm"
                type="number"
                value={newHoliday.seats}
                onChange={(e) =>
                  setNewHoliday((prev) => ({
                    ...prev,
                    seats: Number.parseInt(e.target.value),
                  }))
                }
                min="1"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={addHoliday}
                className=" uppercase w-full text-[#000000] border-gray-800 bg-gradient-to-t to-[#d6fbf7] from-[#c0eae5] p-5 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </Button>
            </div>
          </div>

          {/* Holiday List */}
          {holidays.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Scheduled Holiday Hours
              </Label>
              {holidays.map((holiday, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{holiday.date}</span>
                    <span className="text-gray-600">
                      {formatTime(holiday.startTime)} -{' '}
                      {formatTime(holiday.endTime)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {holiday.seats} seats
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHoliday(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="lg:flex justify-between pt-4">
        <Button
          onClick={onBack}
          className="w-full lg:w-2/6 text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] p-5 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 "
        >
          <ArrowLeft />
          <span>Back to Service Details</span>
        </Button>
        <Button
          onClick={handleSubmit}
          className="w-full lg:w-2/6 text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80 p-5 cursor-pointer text-sm mt-2 shadow-amber-500d shadow-sm rounded-sm border-b-4 border-r-4  shadow-gray-500 "
        >
          <span> Continue to Review</span>
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
