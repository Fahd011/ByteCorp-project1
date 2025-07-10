import { z } from 'zod';

export const benefitTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
});

export const benefitTypeIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number)
  });