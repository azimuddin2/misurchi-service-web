import { TService } from './service.type';

export type TPaymentType = 'half' | 'full' | 'later';

export type TBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled'
  | 'completed';
export type TPaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type TBooking = {
  _id: string;
  serviceId: string;
  service: TService;
  serviceItemId: string;
  name: string;
  email: string;
  phone: string;
  serviceName: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  status: TBookingStatus;
  paymentType: TPaymentType;
  paymentStatus: TPaymentStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
