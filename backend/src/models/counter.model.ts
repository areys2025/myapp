// backend/models/Counter.ts
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 2025 },
});

export default mongoose.model('Counter', counterSchema);
