import { Request, Response } from 'express';
import Expense from '../models/expenseModel';
import { expId } from '../config/getNextId';

export const getAllExpenses = async (_req: Request, res: Response) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoices', error });
  }
};


export const createExpense = async (req: Request, res: Response) => {
  const expid = await  expId();
  
  try {
    // Fetch existing expenses to calculate the new ID
    const allExpenses = await Expense.find();
    const newId = `${expid}`;

    const newExpense = await Expense.create({
      ...req.body,
      id: newId,
    });

    res.status(201).json(newExpense);
  } catch (error) {
    console.error('Expense creation failed:', error);
    res.status(400).json({ message: 'Error creating expense request', error });
  }
};
