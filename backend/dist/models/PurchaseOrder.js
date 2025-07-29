"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const purchaseOrderSchema = new mongoose_1.default.Schema({
    itemId: { type: String, required: true, unique: true },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    orderDate: { type: Date, required: true },
    expectedDeliveryDate: { type: Date, required: true },
    status: { type: String, enum: ['Pending', 'Received', 'Cancelled'], default: 'Pending' },
    supplier: { type: String, required: true },
    totalCost: { type: Number, required: true },
});
exports.default = mongoose_1.default.model('PurchaseOrder', purchaseOrderSchema);
