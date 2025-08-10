import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  TicketId: { type: String, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: {
    name: String,
    email: String,
    contactNumber: String
  },
  deviceInfo: String,
  cost: { type: Number, default: 0 },
  completionDate: Date,
  status: { type: String, enum: ['Pending', 'Paid', 'Completed'], default: 'Pending' },
  notes: String
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
