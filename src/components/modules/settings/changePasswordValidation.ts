import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    oldPassword: z.string({
      required_error: 'Current password is required',
    }),

    newPassword: z
      .string({
        required_error: 'New password is required',
      })
      .min(8, 'New Password must be at least 8 characters')
      .regex(/[a-z]/, 'New Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'New Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'New Password must contain at least one number')
      .regex(
        /[!@#$%^&*]/,
        'New Password must contain at least one special character',
      ),

    confirmPassword: z.string({
      required_error: 'Confirm password is required',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
