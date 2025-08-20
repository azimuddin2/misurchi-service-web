export interface IServicePricing {
  id: string;
  duration: string;
  price: string;
  discountPrice: string;
  finalPrice: string;
}

// Define a Day type (strict union instead of free string)
type WeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Schedule structure for a single day
interface DaySchedule {
  enabled: boolean;
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "17:00"
  seats: number;
}

// Holiday schedule (for exceptions)
interface HolidaySchedule {
  date: string; // ISO date string "2025-08-20"
  startTime: string; // e.g., "10:00"
  endTime: string; // e.g., "14:00"
  seats: number;
}

// Main ServiceData type
export type TService = {
  user: string;
  name: string;
  type: string;
  savedServices: IServicePricing[];
  description: string; // optional
  images: string[];
  status: string;
  highlightStatus: string;

  availability: {
    weeklySchedule: Partial<Record<WeekDay, DaySchedule>>; // not all days required
    holidays?: HolidaySchedule[]; // optional
  };

  isDeleted: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
