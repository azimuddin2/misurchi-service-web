import { TService } from './service.type';
import { TVendorUser } from './user.type';

export type TPaymentType = 'half' | 'full' | 'later';

export type TBookingStatus =
  | 'pending'
  | 'confirmed'
  | 'ongoing'
  | 'cancelled'
  | 'completed';

export type TPaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type TBookingRequestType = 'none' | 'cancel' | 'reschedule';

export interface IBookingRequest {
  type?: TBookingRequestType;
  reason?: string;
  newDate?: string;
  newTime?: string;
  vendorApproved?: boolean;
  updatedAt?: Date;
}

export type TBooking = {
  _id: string;
  vendor: TVendorUser;
  user: string;
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

  isPaid: boolean;
  trnId: string;

  // Request field for cancel/reschedule
  request?: IBookingRequest;

  assignedTo: string | null;

  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
