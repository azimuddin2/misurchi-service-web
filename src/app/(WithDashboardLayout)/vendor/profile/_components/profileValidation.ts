import { z } from 'zod';

export const vendorProfileSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  street: z.string().min(1, 'Street address is required'),
  zipCode: z.string().min(1, 'Zip code is required'),
  currency: z.string().min(1, 'Currency is required'),
  timeZone: z.string().min(1, 'Time zone is required'),
  workHours: z.string().min(1, 'Work hours is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  description: z
    .string({ required_error: 'Description is required' })
    .min(100, 'Description must be at least 100 characters'), // ✅ updated
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  streetAddress: z.string().optional(),
});

export type TVendorProfileForm = z.infer<typeof vendorProfileSchema>;
