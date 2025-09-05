import { z } from 'zod';

export const bookingSchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Full name must be at least 2 characters'),

  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),

  phone: z
    .string({ required_error: 'Phone number is required' })
    .min(1, 'Phone number is required')
    .regex(/^\+?\d+$/, 'Phone number must contain only digits'),

  serviceName: z
    .string({ required_error: 'Service name is required' })
    .min(1, 'Service name is required'),

  duration: z
    .string({ required_error: 'Duration is required' })
    .min(1, 'Duration is required'),

  price: z
    .string({ required_error: 'Price is required' })
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid number'),

  date: z
    .string({ required_error: 'Date is required' })
    .min(1, 'Date is required'),

  time: z
    .string({ required_error: 'Time is required' })
    .min(1, 'Time is required'),

  paymentType: z.enum(['half', 'full', 'later'], {
    required_error: 'Payment type is required',
  }),
});

// export type BookingSchemaType = z.infer<typeof bookingSchema>;
