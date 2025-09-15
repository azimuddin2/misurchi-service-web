export type TOrderStatus =
  | 'pending'
  | 'shipped'
  | 'cancelled'
  | 'delivered'
  | 'return';

export type TOrderProduct = {
  name: string;
  image: string;
  product: string;
  quantity: number;
  price: number;
  discount: number;
};

export type TOrder = {
  products: TOrderProduct[];
  vendor: string;
  buyer: string;

  customerName: string;
  customerEmail: string;
  customerPhone: string;

  totalPrice: number;

  status: TOrderStatus;
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
