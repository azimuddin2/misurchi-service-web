import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: 'New Password is required' })
      .min(8, 'New Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must include an uppercase letter')
      .regex(/[a-z]/, 'Must include a lowercase letter')
      .regex(/[0-9]/, 'Must include a number')
      .regex(/[^A-Za-z0-9]/, 'Must include a special character'),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterSchema = z.infer<typeof resetPasswordSchema>;
