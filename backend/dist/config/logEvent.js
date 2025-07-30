"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logEvent = void 0;
const SystemLog_1 = __importDefault(require("../models/SystemLog"));
const logEvent = async (action, actor, role, details = {}) => {
    try {
        const now = new Date();
        const formattedDate = now.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        await SystemLog_1.default.create({
            action,
            actor,
            role,
            details,
            date: formattedDate,
            timestamp: now
        });
    }
    catch (err) {
        console.error('Logging error:', err);
    }
};
exports.logEvent = logEvent;
