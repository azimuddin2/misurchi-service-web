import { TReview } from './review.type';
import { TVendorUser } from './user.type';

export type TProductType = {
  _id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TProduct = {
  _id: string;
  vendor: TVendorUser;
  name: string;
  productCode: string;
  images: TImage[];
  productType: string;
  quantity: number;
  price: number;
  discountPrice: string;
  colors: string[];
  size: string;
  status: 'Available' | 'Out of Stock' | 'TBC' | 'Discontinued';
  highlightStatus: string;
  description: string;
  reviews?: TReview[]; // can store populated reviews
  avgRating?: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TImage = {
  url: string;
  key: string;
};
