import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  userEmail: { type: String, required: true },
  walletAddress: { type: String, required: true },
  date: { type: Date, default: Date.now },
  assignedTechnicianId:{ type: String }
});

export default mongoose.model('Feedback', FeedbackSchema);
