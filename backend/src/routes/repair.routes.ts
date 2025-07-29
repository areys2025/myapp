import express from 'express';
const router = express.Router();
import { authenticateToken } from '../middleware/auth';

import { createRepair, getRepairTickets,updateRepair,getRepairById ,updateRepairByTicketId } from '../controllers/repair.controller';
import { getRepairTicketsForTech } from '../controllers/repair.controller';

router.post('/', createRepair);
router.get('/', getRepairTickets);

router.get('/', updateRepairByTicketId);

router.post('/', authenticateToken, createRepair);

// router.post('/', createRepair);
router.get('/',authenticateToken, getRepairTickets);
router.put("/:_id", authenticateToken, updateRepair) // expects a MongoDB ObjectId
// router.put('/:TicketId', updateRepairByTicketId);

router.get('/:customerId', getRepairById);


router.get('/', getRepairTicketsForTech);


export default router; 