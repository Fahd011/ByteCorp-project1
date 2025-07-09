import { Request, Response, NextFunction} from 'express';
import { updateBenefitType } from '../services/benefitTypeService';
import { benefitTypeSchema } from '../validators/benefitTypeValidator';


export const handleUpdateBenefitType = async (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id, 10);
  try {
    
    const parsedBody = benefitTypeSchema.parse(req.body);

    await updateBenefitType(id, parsedBody.name);
    return res.status(200).json({ message: 'Benefit type updated successfully' });

  } catch (error: any) {
    if (error.name === 'ZodError') {
        return res.status(400).json({ errors: error.errors });
      }
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