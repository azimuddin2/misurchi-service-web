export type TRole = 'service_provider' | 'user' | 'admin';

export type TStatus = 'ongoing' | 'confirmed' | 'blocked';

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
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
