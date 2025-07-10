import { Request, Response, NextFunction } from 'express';
import { getAllTaxSlabs, updateTaxSlab } from '../services/taxService';
import { TaxSlab } from '../types';
import { TaxIdParamSchema } from '../validators/taxValidator';

export const getAllTaxSlabsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const slabs: TaxSlab[] = await getAllTaxSlabs();
    res.status(200).json(slabs);
  } catch (error) {
    console.error('Error fetching tax slabs:', error);
    next(error); 
  }
};


export const updateTaxSlabHandler = async (req: Request, res: Response, next: NextFunction) => {
    
    const { min_salary, max_salary, percentage } = req.body;
  
    if (
        typeof min_salary !== 'number' ||
      (max_salary !== null && typeof max_salary !== 'number') ||
      typeof percentage !== 'number'
    ) {
      return res.status(400).json({ error: 'Invalid input format' });
    }
  
    try {
      const { id } = TaxIdParamSchema.parse(req.params);
      await updateTaxSlab(id, min_salary, max_salary, percentage);
      res.status(200).json({ message: 'Tax slab updated successfully' });
    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({ error: 'Invalid user ID format', details: error.errors });
          }
      next(error); // Pass to error handler middleware
    }
  };