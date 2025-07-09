import { z } from 'zod';

export const benefitTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
});