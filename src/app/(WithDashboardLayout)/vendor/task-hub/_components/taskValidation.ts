import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
    })
    .min(1, 'Title is required'),

  description: z
    .string({
      required_error: 'Description is required',
    })
    .min(1, 'Description is required'),

  assignTeamMember: z
    .string({
      required_error: 'Team member is required',
    })
    .min(1, 'Team member is required'),
});
