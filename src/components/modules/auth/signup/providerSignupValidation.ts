import { z } from 'zod';

export const providerSignupSchema = z
  .object({
    businessName: z.string({ required_error: 'Business name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
    phone: z.string({ required_error: 'Phone number is required' }),
    country: z.string({ required_error: 'Country is required' }),
    street: z.string({ required_error: 'Street is required' }),
    state: z.string({ required_error: 'State is required' }),
    zip: z.string({ required_error: 'Zip code is required' }),
    currency: z.string({ required_error: 'Currency is required' }),
    timezone: z.string({ required_error: 'Timezone is required' }),
    workHours: z.string({ required_error: 'Work hours are required' }),
    firstName: z.string({ required_error: 'First Name is required' }),
    lastName: z.string({ required_error: 'Last Name is required' }),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterSchema = z.infer<typeof providerSignupSchema>;
