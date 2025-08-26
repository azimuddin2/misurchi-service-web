'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TimeSelectProps = {
  value?: string; // make optional to allow default
  onChange: (value: string) => void;
  interval?: number; // minutes (default: 30 min steps)
  defaultTime?: string; // e.g., "09:00 AM"
};

export function TimeSelect({
  value,
  onChange,
  interval = 30,
  defaultTime,
}: TimeSelectProps) {
  const [selectedTime, setSelectedTime] = React.useState(
    value || defaultTime || '',
  );

  const generateTimes = () => {
    const times: string[] = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 24 * (60 / interval); i++) {
      const hours = start.getHours();
      const minutes = start.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');

      times.push(`${displayHours}:${displayMinutes} ${ampm}`);
      start.setMinutes(start.getMinutes() + interval);
    }
    return times;
  };

  const handleChange = (val: string) => {
    setSelectedTime(val);
    onChange(val);
  };

  return (
    <Select value={selectedTime} onValueChange={handleChange}>
      <SelectTrigger className="w-36 flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <SelectValue placeholder="Select time" />
      </SelectTrigger>
      <SelectContent>
        {generateTimes().map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
