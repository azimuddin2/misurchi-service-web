export type TProduct = {
  _id: string;
  user: string;
  name: string;
  images: TImage[];
  productType: string;
  quantity: number;
  price: number;
  discountPrice: number;
  colors: string[];
  size: string;
  status: string;
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
