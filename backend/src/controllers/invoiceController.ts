import { Request, Response } from 'express';
import invoicesItem from '../models/invoiceModel'; '../models/invoiceModel';
import expenses from '../models/expenseModel';

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await invoicesItem.find({
      status: { $in: ['COMPLETED', 'PAID'] },
      cost: { $gt: 0 }
    });

    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
};

export const getAllExpenses = async (_req: Request, res: Response) => {
  try {
    const invoices = await expenses.find();
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch invoices', error });
  }
};

// create new invoice
export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoicesItems = await invoicesItem.create({
      ...req.body
    });
    res.status(201).json(invoicesItems);
  } catch (error) {
    res.status(400).json({ message: 'Error creating invoice request' });
  }
};


// Get invoice by ID
export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const invoice = await invoicesItem.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching invoice' });
  }
};


// export const deleteInvoice = (req: Request, res: Response) => {
//   const index = invoicesItemSchema.findIndex(inv => inv.id === req.params.id);
//   if (index === -1) return res.status(404).json({ message: 'Invoice not found' });
//   invoicesItemSchema.splice(index, 1);
//   res.status(204).send();
// };
