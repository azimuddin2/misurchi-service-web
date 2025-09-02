import { IUser } from './user.type';

export type TReview = {
  _id: string;
  user: IUser;
  service?: IService;
  product?: IProduct;
  review: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
};

export interface IService {
  _id: string;
  name: string;
  images: Image[];
  type: string;
}

export interface IProduct {
  _id: string;
  name: string;
  images: Image[];
  productType: string;
}

export interface Image {
  url: string;
  key: string;
}
