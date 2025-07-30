"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/models/Counter.ts
const mongoose_1 = __importDefault(require("mongoose"));
const counterSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, default: 2025 },
});
exports.default = mongoose_1.default.model('Counter', counterSchema);
