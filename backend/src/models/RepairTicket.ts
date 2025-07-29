import mongoose, { Schema, Document } from 'mongoose';

export interface IRepairTicket extends Document {
  TicketId: string;
  deviceInfo: string;
  issueDescription: string;
  assignedTechnicianId?: string;
  status: string;
}

const RepairTicketSchema = new Schema<IRepairTicket>({
  TicketId: { type: String, required: true }, // ✅ FIXED HERE
  deviceInfo: { type: String, required: true },
  issueDescription: { type: String, required: true },
  assignedTechnicianId: { type: String, default: null },
  status: {
    type: String,
    enum: ['Requested', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Requested',
  },
}, { timestamps: true });

const RepairTicket = mongoose.model<IRepairTicket>('RepairTicket', RepairTicketSchema);
export default RepairTicket;
