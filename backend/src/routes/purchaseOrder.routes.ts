import express from 'express';
import {
  createPurchaseOrder,
  getAllPurchaseOrders,
  updatePurchaseOrder,
  getPurchaseOrderById
} from '../controllers/purchaseOrder.controller';

const router = express.Router();

router.post('/', createPurchaseOrder);
router.get('/', getAllPurchaseOrders);
router.put('/:id', updatePurchaseOrder);
router.get('/:id', getPurchaseOrderById);


export default router;
