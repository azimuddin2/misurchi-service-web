import { IUser } from './user.type';

export type TValidityType =
  | 'unlimited'
  | '1month'
  | '3month'
  | '6month'
  | 'custom';

export type TSubscriptionPlan = {
  _id: string;
  user: IUser;
  name: string;
  cost: number;
  description: string;

  features: {
    teamMembers: boolean;
    sharedCalendar: boolean;
    taskHub: boolean;
    grantPermissionAccess: boolean;
  };

  limits: {
    serviceMax: number;
    productMax: number;
    highlightOfferMax: number;
    transactionFee: number;
  };

  validity: {
    type: TValidityType;
    durationInMonths?: string;
  };

  isDeleted?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
