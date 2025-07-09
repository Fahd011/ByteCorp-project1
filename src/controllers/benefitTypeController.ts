import { Request, Response, NextFunction} from 'express';
import { updateBenefitType } from '../services/benefitTypeService';


export const handleUpdateBenefitType = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  const { name } = req.body;

  if (isNaN(id) || typeof name !== 'string' || !name.trim()) {
     return next({ message: 'Invalid id or name', status: 400 });
  }

  try {
    await updateBenefitType(id, name);
    return res.status(200).json({ message: 'Benefit type updated successfully' });
  } catch (error: any) {

    // New Error Handling
    if (error.message === 'NOT_FOUND') {
        return next({ status: 404, message: 'Benefit type not found' });
      }
      if (error.message === 'DUPLICATE_NAME') {
        return next({ status: 409, message: 'Benefit type name already exists' });
      }
  
      //Passing unexpected error
      return next(error);
  }
};