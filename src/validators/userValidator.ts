import { z } from 'zod';

export const updateUserSalarySchema = z.object({
  salary: z.number().min(0, 'Salary must be a positive number'),
});

export const updateUserBenefitsSchema = z.object({
  benefits: z.record(z.string(), z.number().min(0)),
});