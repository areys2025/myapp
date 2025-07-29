"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FeedbackSchema = new mongoose_1.default.Schema({
    ticketId: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
    userEmail: { type: String, required: true },
    walletAddress: { type: String, required: true },
    date: { type: Date, default: Date.now },
    assignedTechnicianId: { type: String }
});
exports.default = mongoose_1.default.model('Feedback', FeedbackSchema);
