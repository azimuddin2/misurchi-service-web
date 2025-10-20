import { IUser, TVendorUser } from './user.type';

export type TImage = {
  url: string;
  key: string;
};

export type TOrderStatus = 'pending' | 'shipped' | 'delivered';

export type TOrderRequestType = 'none' | 'cancelled' | 'return';

export type TOrderRequest = {
  type?: TOrderRequestType;
  images?: TImage[];
  reason?: string;
  vendorApproved?: boolean;
  updatedAt?: Date;
};

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
  orderId: string;
  products: TOrderProduct[];
  vendor: TVendorUser;
  buyer: IUser;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  totalPrice: number;

  status: TOrderStatus;
  request: TOrderRequest;
  isPaid: boolean;
  trnId: string;
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
