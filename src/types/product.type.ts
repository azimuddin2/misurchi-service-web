import { IUser } from './user.type';

export type TProduct = {
  _id: string;
  user: IUser;
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
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type TImage = {
  url: string;
  key: string;
};
