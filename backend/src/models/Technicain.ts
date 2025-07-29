// backend/models/Technician.ts
import mongoose from 'mongoose';

const technicianSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  availability: { type: String, required: true },
specialization: [{ type: String,required: true }],
  walletAddress: { type: String, required: true },
  role: { type: String, default: 'TECHNICIAN' },
}, { timestamps: true });




export default mongoose.model('Technician', technicianSchema);