"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
router.post('/send', async (req, res) => {
    try {
        const { billedTo, invoiceInfo, repairDetails, totalDue } = req.body;
        if (!(billedTo === null || billedTo === void 0 ? void 0 : billedTo.email)) {
            return res.status(400).json({ message: 'Customer email is required.' });
        }
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const repairsHtml = repairDetails
            .map((item) => `<tr><td>${item.description}</td><td>$${item.amount}</td></tr>`)
            .join('');
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: billedTo.email,
            subject: `Invoice #${invoiceInfo.id} - ChainRepair Mobile Management`,
            html: `
        <h2>Repair Invoice</h2>
        <p><strong>Billed To:</strong> ${billedTo.name} (${billedTo.contact})</p>
        <p><strong>Invoice ID:</strong> ${invoiceInfo.id}</p>
        <p><strong>Date:</strong> ${invoiceInfo.date}</p>
        <p><strong>Status:</strong> ${invoiceInfo.status}</p>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr><th>Description</th><th>Amount</th></tr>
          ${repairsHtml}
        </table>
        <h3>Total Due: $${totalDue}</h3>
        <p>Thank you for choosing ChainRepair Mobile Management!</p>
      `,
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Invoice sent successfully!' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send invoice.' });
    }
});
exports.default = router;
