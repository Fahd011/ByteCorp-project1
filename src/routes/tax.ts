import express from 'express';
import { getAllTaxSlabsHandler, updateTaxSlabHandler } from '../controllers/taxController';
import { validateBody } from '../middleware/validate';
import { taxSchema } from '../validators/taxValidator';

const router = express.Router();

router.get('/', getAllTaxSlabsHandler);

router.put('/:id', validateBody(taxSchema), updateTaxSlabHandler);

export default router;