"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/models/Technician.ts
const mongoose_1 = __importDefault(require("mongoose"));
const technicianSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    availability: { type: String, required: true },
    specialization: [{ type: String, required: true }],
    walletAddress: { type: String, required: true },
    role: { type: String, default: 'TECHNICIAN' },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Technician', technicianSchema);
