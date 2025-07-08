import express from 'express';
import {
  getAllUsersHandler,
  getUserByIdHandler,
  getMonthlySalaryHandler,
  getAnnualSalaryHandler,
  updateUserSalaryHandler,
  updateUserBenefitsHandler
} from '../controllers/userController';

const router = express.Router();

router.get('/', getAllUsersHandler);
router.get('/:id', getUserByIdHandler);
router.get('/:id/monthly-salary', getMonthlySalaryHandler);
router.get('/:id/annual-salary', getAnnualSalaryHandler);
router.put('/:id/salary', updateUserSalaryHandler);
router.put('/:id/benefits', updateUserBenefitsHandler);

export default router;
