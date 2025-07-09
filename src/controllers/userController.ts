//Replaced res.json with next to pass errors to the error handling middleware

import { Request, Response, NextFunction } from 'express';
import {
  getAllUsers,
  getUserById,
  calculateNetSalary,
  updateUserSalary,
  updateUserBenefits
} from '../services/userService';

export const getAllUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
     next(err);
  }
};

export const getUserByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) return next({ status: 400, message: 'Invalid user ID' });

  try {
    const user = await getUserById(userId);
    if (!user) return next({ status: 404, message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getMonthlySalaryHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) return next({ status: 400, message: 'Invalid user ID' });

  try {
    const result = await calculateNetSalary(userId);
    res.json({
      user: result.user,
      gross_monthly_salary: result.grossMonthly,
      tax_percent: result.taxPercent,
      tax_amount: result.taxAmount,
      net_monthly_salary: result.netMonthly
    });
  } catch (err) {
     next(err);
  }
};

export const getAnnualSalaryHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) return next({ status: 400, message: 'Invalid user ID' });

  try {
    const result = await calculateNetSalary(userId);
    res.json({
      user: result.user,
      gross_annual_salary: result.grossMonthly * 12,
      tax_percent: result.taxPercent,
      tax_amount: result.taxAmount * 12,
      net_annual_salary: result.netAnnual
    });
  } catch (err) {
    next(err)
  }
};

export const updateUserSalaryHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.id);
  const { salary } = req.body;
  if (isNaN(userId)) return next({ status: 400, message: 'Invalid user ID' });
  if (typeof salary !== 'number' || salary <= 0) {
    return next({ status: 400, message: 'Invalid salary value' });
  }

  try {
    const updated = await updateUserSalary(userId, salary);
    res.status(200).json({ message: 'Salary updated successfully', user: updated });
  } catch (err) {
    next(err);
  }
};

export const updateUserBenefitsHandler = async (req: Request, res: Response, next: NextFunction) => {
  const userId = parseInt(req.params.id);
  const { benefits } = req.body;

  try {
    await updateUserBenefits(userId, benefits);
    res.status(200).json({ message: 'Benefits updated successfully' });
  } catch (err) {
    next(err)
  }
};
