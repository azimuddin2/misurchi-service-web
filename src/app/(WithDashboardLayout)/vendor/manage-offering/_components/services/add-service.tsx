'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type DaySchedule = {
  enabled: boolean;
  startTime: string;
  endTime: string;
  seats: number | '';
};

const defaultDaySchedule: DaySchedule = {
  enabled: false,
  startTime: '09:00',
  endTime: '17:00',
  seats: 15,
};

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const AddService = () => {
  // State for Weekly schedule - one entry per day
  const [weeklySchedule, setWeeklySchedule] = useState<
    Record<string, DaySchedule>
  >(() =>
    days.reduce(
      (acc, day) => {
        acc[day] = { ...defaultDaySchedule };
        return acc;
      },
      {} as Record<string, DaySchedule>,
    ),
  );

  // State for Holiday Hours calendar date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  // Handler to toggle enabled switch per day
  const handleToggleDay = (day: string) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], enabled: !prev[day].enabled },
    }));
  };

  // Handler to update time or seats for a day
  const handleChange = (
    day: string,
    field: keyof DaySchedule,
    value: string | number,
  ) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  return (
    <div className="max-w-5xl p-6 space-y-8">
      <Card className=" shadow border-none">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Manage Service Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Weekly Schedule */}
          <div className="space-y-4">
            <h2 className="font-semibold">Weekly Schedule</h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Calendar to pick week start or any date */}
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="max-w-xs"
              />

              {/* Schedule per day */}
              <div className="space-y-3 flex-1">
                {days.map((day) => {
                  const schedule = weeklySchedule[day];
                  return (
                    <div
                      key={day}
                      className="grid grid-cols-[auto_100px_1fr_auto_1fr_100px] items-center gap-4"
                    >
                      <Switch
                        checked={schedule.enabled}
                        onCheckedChange={() => handleToggleDay(day)}
                        aria-label={`Enable ${day} schedule`}
                      />
                      <span className="font-medium">{day}</span>
                      <Input
                        type="time"
                        value={schedule.startTime}
                        disabled={!schedule.enabled}
                        onChange={(e) =>
                          handleChange(day, 'startTime', e.target.value)
                        }
                        aria-label={`${day} start time`}
                      />
                      <span className="text-center">-</span>
                      <Input
                        type="time"
                        value={schedule.endTime}
                        disabled={!schedule.enabled}
                        onChange={(e) =>
                          handleChange(day, 'endTime', e.target.value)
                        }
                        aria-label={`${day} end time`}
                      />
                      <Input
                        type="number"
                        className="w-full"
                        placeholder="Seats"
                        value={schedule.seats}
                        disabled={!schedule.enabled}
                        min={0}
                        onChange={(e) =>
                          handleChange(day, 'seats', Number(e.target.value))
                        }
                        aria-label={`${day} seats available`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Separator />

          {/* Holiday Hours */}
          <div className="space-y-4">
            <h2 className="font-semibold">Holiday Hours</h2>
            <div className="flex gap-6 flex-col md:flex-row">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
              <div className="space-y-4 w-full">
                <div className="flex gap-4">
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Start Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">09:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="End Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="17:00">05:00 PM</SelectItem>
                      <SelectItem value="18:00">06:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input type="number" placeholder="Seats" />
                <Button className="w-full">Save Slot</Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Save Changes */}
          <div className="pt-4">
            <Button className="w-full" size="lg">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddService;
