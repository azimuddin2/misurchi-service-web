import { TUser } from '@/redux/features/auth/authSlice';
import { TVendorUser } from './user.type';

export type TOrderStatus = 'pending' | 'shipped' | 'delivered';

export type TOrderRequest = 'cancelled' | 'return';

export type TOrderProduct = {
  name: string;
  image: string;
  product: string;
  quantity: number;
  price: number;
  discount: number;
};

export type TOrder = {
  _id: string;
  products: TOrderProduct[];
  vendor: TVendorUser;
  buyer: TUser;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  totalPrice: number;

  status: TOrderStatus;
  request: TOrderRequest;
  isPaid: boolean;
  billingDetails: {
    country: string;
    city?: string;
    state: string;
    zipCode: string;
    address: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
