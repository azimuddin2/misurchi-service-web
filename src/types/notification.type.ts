export type TNotification = {
  _id: string;
  receiver: string;
  reference: string;
  model_type: string;
  message: string;
  description: string;
  read: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
