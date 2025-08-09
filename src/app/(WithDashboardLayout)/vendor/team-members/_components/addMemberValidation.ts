import { z } from 'zod';

export const addMemberSchema = z.object({
  name: z.string({
    required_error: 'Name is required',
  }),

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

  assignTask: z.string({
    required_error: 'At least one task is required',
  }),

  phone: z
    .string({
      required_error: 'Phone number is required',
    })
    .regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
});
