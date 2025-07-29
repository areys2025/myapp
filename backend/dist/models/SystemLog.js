"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const systemLogSchema = new mongoose_1.default.Schema({
    action: { type: String, required: true },
    actor: { type: String }, // e.g., email or user ID
    role: { type: String },
    details: { type: Object }, // dynamic field for extra data
    date: { type: String }, // formatted date string
    timestamp: { type: Date, default: Date.now } // raw timestamp for sorting
});
exports.default = mongoose_1.default.model('SystemLog', systemLogSchema);
