"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const InventoryItemSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    minStockLevel: { type: Number, required: true },
    price: { type: Number, required: true },
    supplier: { type: String, default: '' }
}, { timestamps: true });
exports.default = mongoose_1.default.model('InventoryItem', InventoryItemSchema);
