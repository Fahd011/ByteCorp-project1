import { z } from 'zod';

export const taxSchema = z.object({
  min_salary: z.number({
    required_error: 'min_salary is required',
    invalid_type_error: 'min_salary must be a number'
  }).nonnegative({ message: 'min_salary cannot be negative' }),

  max_salary: z.union([
    z.number({ invalid_type_error: 'max_salary must be a number' }).nonnegative({ message: 'min_salary cannot be negative' }),
    z.null()
  ]),

  percentage: z.number({
    required_error: 'percentage is required',
    invalid_type_error: 'percentage must be a number'
  }).nonnegative({ message: 'min_salary cannot be negative' })
});

export const TaxIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number)
  });