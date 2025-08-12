import { z } from 'zod';

export const addTaskSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }),

  description: z.string({
    required_error: 'Description is required',
  }),

  assignTeamMember: z.string({
    required_error: 'Team member is required',
  }),
});
