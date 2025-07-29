import mongoose from 'mongoose';

const systemLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actor: { type: String }, // e.g., email or user ID
  role: { type: String },
  details: { type: Object }, // dynamic field for extra data
  date: { type: String }, // formatted date string
  timestamp: { type: Date, default: Date.now } // raw timestamp for sorting
});

export default mongoose.model('SystemLog', systemLogSchema);
