"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFeedbacks = exports.submitFeedback = void 0;
const Feedback_1 = __importDefault(require("../models/Feedback"));
const submitFeedback = async (req, res) => {
    const { ticketId, rating, comment, date, userEmail, walletAddress, assignedTechnicianId } = req.body;
    if (!ticketId || !rating || !userEmail || !walletAddress) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    console.log('Incoming feedback:', req.body);
    try {
        const feedback = new Feedback_1.default({
            ticketId,
            rating,
            comment,
            userEmail,
            walletAddress,
            date: date || new Date(),
            assignedTechnicianId,
        });
        await feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully', feedback });
    }
    catch (err) {
        console.error('Error saving feedback:', err);
        res.status(500).json({ message: 'Server error saving feedback' });
    }
};
exports.submitFeedback = submitFeedback;
// feedback.controller.ts
const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback_1.default.find();
        res.json(feedbacks);
    }
    catch (error) {
        console.error('❌ Error fetching feedback:', error);
        res.status(500).json({ message: 'Failed to load feedback' });
    }
};
exports.getAllFeedbacks = getAllFeedbacks;
