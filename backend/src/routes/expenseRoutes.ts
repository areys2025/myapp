import express from 'express';
import { createExpense, getAllExpenses } from '../controllers/expenseController';

const router = express.Router();

router.get('/', getAllExpenses);
router.post('/', createExpense);
// router.get('/:id', getExpenseById);
// router.delete('/:id', deleteExpense);

export default router;
