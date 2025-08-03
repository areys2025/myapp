import { Request, Response } from 'express';
import invoicesItem from '../models/invoiceModel'; '../models/invoiceModel';
import expenses from '../models/expenseModel';


import { sendInvoiceEmail } from '../config/sendInvoiceEmail';

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoiceData = req.body;

    // Create and save invoice to DB
    const newInvoice = await invoicesItem.create(invoiceData);

    // Send invoice email if customer email is present
    if (invoiceData?.customer?.email) {
      await sendInvoiceEmail(invoiceData.customer.email, newInvoice);
    }

    res.status(201).json(newInvoice);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error creating invoice' });
  }
};

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
