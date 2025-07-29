import express from 'express';
import { processBlockchainPayment } from '../controllers/paymentController';

const router = express.Router();

router.post('/payments', processBlockchainPayment);

export default router;
