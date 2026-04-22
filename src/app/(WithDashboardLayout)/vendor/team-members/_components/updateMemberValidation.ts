import { z } from 'zod';

export const updateMemberSchema = z.object({
  firstName: z.string({ required_error: 'First Name is required' }),
  lastName: z.string({ required_error: 'Last Name is required' }),

  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email address'),

  role: z.string({
    required_error: 'Role is required',
  }),

  speciality: z.string({
    required_error: 'Speciality is required',
  }),

  timeZone: z.string({
    required_error: 'Time zone is required',
  }),

  workHours: z.string({
    required_error: 'Work hours are required',
  }),

  phone: z
    .string({
      required_error: 'Phone number is required',
    })
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
});
