import express from 'express';
import { handleUpdateBenefitType } from '../controllers/benefitTypeController';
import { benefitTypeSchema } from '../validators/benefitTypeValidator';
import { validateBody } from '../middleware/validate';

const router = express.Router();

router.put('/:id', validateBody(benefitTypeSchema) , handleUpdateBenefitType);

export default router;
