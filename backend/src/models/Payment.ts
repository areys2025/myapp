import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  ticketId: string;
  amount: number;
  transactionId: string;
  status: 'success' | 'failed';
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    ticketId: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, enum: ['success', 'failed'], default: 'success' },
  },
  { timestamps: true }
);

export default mongoose.model<IPayment>('Payment', PaymentSchema);
