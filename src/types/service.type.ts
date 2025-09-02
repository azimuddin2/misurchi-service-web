import { IUser } from './user.type';

export type TStatus = 'available' | 'unavailable';

export type TServicePricing = {
  id: string;
  duration: string;
  price: string;
  discount: string;
  finalPrice: string;
};

// Define a Day type (strict union instead of free string)
export type TWeekDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// Schedule structure for a single day
export type TDaySchedule = {
  enabled: boolean;
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "17:00"
};

export type TImage = {
  url: string;
  key: string;
};

// Main ServiceData type
export type TService = {
  user: IUser;
  deleteKey?: string[];
  _id: string;
  serviceId: string;
  name: string;
  type: string;
  savedServices: TServicePricing[];
  description: string; // optional
  images: TImage[];
  status: string;
  highlightStatus: string;

  availability: {
    weeklySchedule: Partial<Record<TWeekDay, TDaySchedule>>; // not all days required
  };

  reviews?: string[]; // can store populated reviews
  avgRating?: number;

  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
