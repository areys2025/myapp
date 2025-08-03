"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInvoiceEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendInvoiceEmail = async (recipientEmail, invoice) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail', // or your preferred provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"${process.env.APP_NAME || 'MyApp'}" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: `Invoice #${invoice.TicketId}`,
        html: `
      <h3>Thank you for your business!</h3>
      <p><strong>Invoice ID:</strong> ${invoice.TicketId}</p>
      <p><strong>Status:</strong> ${invoice.status}</p>
      <p><strong>Device:</strong> ${invoice.deviceInfo}</p>
      <p><strong>Amount:</strong> $${(invoice.cost || 0).toFixed(2)}</p>
      <p>We appreciate your prompt payment.</p>
    `,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendInvoiceEmail = sendInvoiceEmail;
