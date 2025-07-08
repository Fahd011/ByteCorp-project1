import { Request, Response } from 'express';
import {
  getAllUsers,
  getUserById,
  calculateNetSalary,
  updateUserSalary,
  updateUserBenefits
} from '../services/userService';

export const getAllUsersHandler = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserByIdHandler = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID' });

  try {
    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMonthlySalaryHandler = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID' });

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
    res.status(500).json({ message: err.message });
  }
};

export const getAnnualSalaryHandler = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID' });

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
    res.status(500).json({ message: err.message });
  }
};

export const updateUserSalaryHandler = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { salary } = req.body;
  if (isNaN(userId)) return res.status(400).json({ message: 'Invalid user ID' });

  try {
    const updated = await updateUserSalary(userId, salary);
    res.status(200).json({ message: 'Salary updated successfully', user: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserBenefitsHandler = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { benefits } = req.body;

  try {
    await updateUserBenefits(userId, benefits);
    res.status(200).json({ message: 'Benefits updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
