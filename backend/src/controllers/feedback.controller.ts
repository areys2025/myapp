// controllers/feedback.controller.ts
import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
export const submitFeedback = async (req: Request, res: Response) => {
  const { ticketId, rating, comment, date, userEmail, walletAddress,assignedTechnicianId } = req.body;

  if (!ticketId || !rating || !userEmail || !walletAddress) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
console.log('Incoming feedback:', req.body);

  try {
    const feedback = new Feedback({
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
  } catch (err) {
    console.error('Error saving feedback:', err);
    res.status(500).json({ message: 'Server error saving feedback' });
  }
};




// feedback.controller.ts
export const getAllFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (error) {
    console.error('❌ Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to load feedback' });
  }
};
