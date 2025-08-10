"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const invoiceSchema = new mongoose_1.default.Schema({
    TicketId: { type: String, required: true },
    customerId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    customer: {
        name: String,
        email: String,
        contactNumber: String
    },
    deviceInfo: String,
    cost: { type: Number, default: 0 },
    completionDate: Date,
    status: { type: String, enum: ['Pending', 'Paid', 'Completed'], default: 'Pending' },
    notes: String
}, { timestamps: true });
exports.default = mongoose_1.default.model('Invoice', invoiceSchema);
