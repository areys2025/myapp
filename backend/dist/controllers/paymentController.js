"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processBlockchainPayment = void 0;
const Payment_1 = __importDefault(require("../models/Payment"));
const RepairTicket_1 = __importDefault(require("../models/RepairTicket"));
const logEvent_1 = require("../config/logEvent");
const processBlockchainPayment = async (req, res) => {
    const { ticketId, amount, transactionId } = req.body;
    console.log('Incoming payment payload:', { ticketId, amount, transactionId });
    if (!ticketId || !amount || !transactionId) {
        return res.status(400).json({ success: false, message: 'ticketId, amount, and transactionId are required' });
    }
    try {
        const paymentRecord = await Payment_1.default.create({
            ticketId,
            amount,
            transactionId, // blockchain transaction hash from MetaMask
            status: 'success',
        });
        if (paymentRecord) {
            await (0, logEvent_1.logEvent)('Cusetomer paid', req.body.LoginfoEml, req.body.LoginfoRle, { CusetomerId: req.params.id });
        }
        // Optionally update repair status to PAID
        await RepairTicket_1.default.findOneAndUpdate({ TicketId: ticketId }, { status: 'Paid' });
        return res.status(200).json({
            success: true,
            transactionId: paymentRecord.transactionId,
            paymentId: paymentRecord._id,
            createdAt: paymentRecord.createdAt,
        });
    }
    catch (error) {
        console.error('Payment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Payment processing failed on the server',
        });
    }
};
exports.processBlockchainPayment = processBlockchainPayment;
