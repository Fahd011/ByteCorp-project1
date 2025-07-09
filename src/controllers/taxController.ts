import { Request, Response, NextFunction } from 'express';
import { getAllTaxSlabs, updateTaxSlab } from '../services/taxService';

export const getAllTaxSlabsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slabs = await getAllTaxSlabs();
    res.status(200).json(slabs);
  } catch (error) {
    console.error('Error fetching tax slabs:', error);
    next(error); 
  }
};


export const updateTaxSlabHandler = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id, 10);
    const { min_salary, max_salary, percentage } = req.body;
  
    if (
      isNaN(id) ||
      typeof min_salary !== 'number' ||
      (max_salary !== null && typeof max_salary !== 'number') ||
      typeof percentage !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid input format' });
    }
  
    try {
      await updateTaxSlab(id, min_salary, max_salary, percentage);
      res.status(200).json({ message: 'Tax slab updated successfully' });
    } catch (error) {
      console.error('Error updating tax slab:', error);
      next(error); // Pass to error handler middleware
    }
  };