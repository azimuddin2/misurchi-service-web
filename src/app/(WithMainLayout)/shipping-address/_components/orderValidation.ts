import { z } from 'zod';

// Define billing details schema
const billingDetailsSchema = z.object({
  country: z.string({ required_error: 'Country is required' }),
  city: z.string().optional(),
  state: z.string({ required_error: 'State is required' }),
  zipCode: z.string({ required_error: 'Zip Code is required' }),
  address: z.string({ required_error: 'Address is required' }),
});

export const orderSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(6, 'Phone number is required'),
  billingDetails: billingDetailsSchema,
});
