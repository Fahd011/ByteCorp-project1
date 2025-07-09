import express from 'express';
import { handleUpdateBenefitType } from '../controllers/benefitTypeController';

const router = express.Router();

router.put('/:id', handleUpdateBenefitType);

export default router;
