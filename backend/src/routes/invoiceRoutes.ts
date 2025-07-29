import express from 'express';
import {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
//   deleteInvoice
} from '../controllers/invoiceController';

const router = express.Router();

router.get('/', getAllInvoices);
router.get('/:id', getInvoiceById);
router.post('/', createInvoice);
// router.delete('/:id', deleteInvoice);

export default router;
