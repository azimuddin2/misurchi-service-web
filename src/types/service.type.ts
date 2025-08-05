export type TService = {
  user: string;
  name: string;
  serviceType: string;
  duration: string;
  price: number;
  discountPrice: number;
  status: string;
  highlightStatus: string;
  description: string;
  images: Image[];
  weeklySchedule: WeeklySchedule[];
  holidaySlots: HolidaySlot[];
  isDeleted: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export interface Image {
  url: string;
  key: string;
}

export interface WeeklySchedule {
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  seatCapacity: number;
  isClosed: boolean;
}

export interface HolidaySlot {
  date: string;
  startTime: string;
  endTime: string;
  seatCapacity: number;
  isClosed: boolean;
}
