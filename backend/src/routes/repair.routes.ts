import express from 'express';
import {
  createRepair,
  getRepairTickets,
  updateRepair,
  getRepairById,
  updateRepairByTicketId,
  getRepairTicketsForTech,
} from '../controllers/repair.controller';

import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, createRepair);

router.get('/', authenticateToken, getRepairTickets);

router.get('/:customerId', getRepairById);

router.get('/filter/technician', getRepairTicketsForTech);

router.put('/:_id', authenticateToken, updateRepair);

router.put('/ticket/:_id', authenticateToken, updateRepairByTicketId);

export default router;
