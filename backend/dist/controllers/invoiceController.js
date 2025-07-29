"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoiceById = exports.createInvoice = exports.getAllExpenses = exports.getAllInvoices = void 0;
const invoiceModel_1 = __importDefault(require("../models/invoiceModel"));
'../models/invoiceModel';
const expenseModel_1 = __importDefault(require("../models/expenseModel"));
const getAllInvoices = async (req, res) => {
    try {
        const invoices = await invoiceModel_1.default.find({
            status: { $in: ['COMPLETED', 'PAID'] },
            cost: { $gt: 0 }
        });
        res.status(200).json(invoices);
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to fetch invoices' });
    }
};
exports.getAllInvoices = getAllInvoices;
const getAllExpenses = async (_req, res) => {
    try {
        const invoices = await expenseModel_1.default.find();
        res.json(invoices);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch invoices', error });
    }
};
exports.getAllExpenses = getAllExpenses;
// create new invoice
const createInvoice = async (req, res) => {
    try {
        const invoicesItems = await invoiceModel_1.default.create(Object.assign({}, req.body));
        res.status(201).json(invoicesItems);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating invoice request' });
    }
};
exports.createInvoice = createInvoice;
// Get invoice by ID
const getInvoiceById = async (req, res) => {
    try {
        const invoice = await invoiceModel_1.default.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'invoice not found' });
        }
        res.json(invoice);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching invoice' });
    }
};
exports.getInvoiceById = getInvoiceById;
// export const deleteInvoice = (req: Request, res: Response) => {
//   const index = invoicesItemSchema.findIndex(inv => inv.id === req.params.id);
//   if (index === -1) return res.status(404).json({ message: 'Invoice not found' });
//   invoicesItemSchema.splice(index, 1);
//   res.status(204).send();
// };
