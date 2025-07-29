import express from 'express';
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  updatePurchaseOrder,
} from '../controllers/purchaseOrder.controller';

const router = express.Router();

router.post('/', createPurchaseOrder);
router.get('/', getAllPurchaseOrders);
router.put('/:id', updatePurchaseOrder);

export default router;
