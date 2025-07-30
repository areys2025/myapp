"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const counterSchema = new mongoose_1.default.Schema({
    key: { type: String, required: true, unique: true }, // e.g., 'technician', 'repair'
    seq: { type: Number, default: 0 },
});
const Counter = mongoose_1.default.model('Counter', counterSchema);
exports.default = Counter;
