"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoiceById = exports.getAllExpenses = exports.getAllInvoices = exports.sendInvoiceToEmail = exports.createInvoice = void 0;
const invoiceModel_1 = __importDefault(require("../models/invoiceModel"));
'../models/invoiceModel';
const expenseModel_1 = __importDefault(require("../models/expenseModel"));
const user_model_1 = __importDefault(require("../models/user.model"));
const sendInvoiceEmail_1 = require("../config/sendInvoiceEmail");
const createInvoice = async (req, res) => {
    var _a;
    try {
        const invoiceData = req.body;
        // Create and save invoice to DB
        const newInvoice = await invoiceModel_1.default.create(invoiceData);
        // Send invoice email if customer email is present
        if ((_a = invoiceData === null || invoiceData === void 0 ? void 0 : invoiceData.customer) === null || _a === void 0 ? void 0 : _a.email) {
            await (0, sendInvoiceEmail_1.sendInvoiceEmail)(invoiceData.customer.email, newInvoice);
        }
        res.status(201).json(newInvoice);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error creating invoice' });
    }
};
exports.createInvoice = createInvoice;
const sendInvoiceToEmail = async (req, res) => {
    var _a;
    try {
        const invoice = await invoiceModel_1.default.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        // Get customer email
        let customerEmail = (_a = invoice === null || invoice === void 0 ? void 0 : invoice.customer) === null || _a === void 0 ? void 0 : _a.email;
        if (!customerEmail && invoice.customerId) {
            const customer = await user_model_1.default.findById(invoice.customerId);
            customerEmail = (customer === null || customer === void 0 ? void 0 : customer.email) || '';
        }
        if (!customerEmail) {
            return res.status(400).json({ message: 'No customer email found' });
        }
        // Send email
        await (0, sendInvoiceEmail_1.sendInvoiceEmail)(customerEmail, invoice);
        res.json({ message: 'Invoice sent successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending invoice' });
    }
};
exports.sendInvoiceToEmail = sendInvoiceToEmail;
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
