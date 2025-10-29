export type TRole = 'vendor' | 'user' | 'admin';

export type TStatus = 'ongoing' | 'confirmed' | 'blocked';
export type TSubscribed = 'advance' | 'basic';

export interface IUser {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  needsPasswordChange: boolean;
  passwordChangeAt?: Date;
  role: TRole;
  coverImage?: string;
  image?: string;
  country?: string;
  status: TStatus;
  isDeleted: boolean;
  isVerified: boolean;
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  isSubscribed: boolean;
  subscribed?: TSubscribed;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type TVendorUser = {
  _id: string;
  userId: IUser;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  street: string;
  state: string;
  zipCode: string;
  currency: string;
  timeZone: string;
  workHours: string;
  firstName: string;
  lastName: string;
  description: string;
  image?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
