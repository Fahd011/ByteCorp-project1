import express from 'express';
import {
  getAllUsersHandler,
  getUserByIdHandler,
  getMonthlySalaryHandler,
  getAnnualSalaryHandler,
  updateUserSalaryHandler,
  updateUserBenefitsHandler
} from '../controllers/userController';
import { validateBody } from '../middleware/validate';
import { updateUserSalarySchema } from '../validators/userValidator';
import { updateUserBenefitsSchema } from '../validators/userValidator';

const router = express.Router();

router.get('/', getAllUsersHandler);
router.get('/:id', getUserByIdHandler);
router.get('/:id/monthly-salary', getMonthlySalaryHandler);
router.get('/:id/annual-salary', getAnnualSalaryHandler);
router.put('/:id/salary', validateBody(updateUserSalarySchema), updateUserSalaryHandler);
router.put('/:id/benefits', validateBody(updateUserBenefitsSchema), updateUserBenefitsHandler);

export default router;
