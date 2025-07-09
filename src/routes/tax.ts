import express from 'express';
import { getAllTaxSlabsHandler, updateTaxSlabHandler } from '../controllers/taxController';

const router = express.Router();

router.get('/', getAllTaxSlabsHandler);

router.put('/:id', updateTaxSlabHandler);

export default router;