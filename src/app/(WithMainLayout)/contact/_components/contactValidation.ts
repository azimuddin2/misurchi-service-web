import { z } from 'zod';

export const contactSchema = z.object({
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, 'First name cannot be empty'),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, 'Last name cannot be empty'),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  message: z
    .string({ required_error: 'Message is required' })
    .min(1, 'Message cannot be empty'),
  follow: z.string().optional(),
});
