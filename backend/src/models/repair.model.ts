import { Schema, model, Document } from 'mongoose';

export enum RepairStatus {
  REQUESTED = 'Requested',
  IN_PROGRESS = 'In Progress',
  WAITING_FOR_PARTS = 'Waiting for Parts',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  PAID = 'Paid'
}

export interface IRepair extends Document {
  TicketId: String;
  TicketNumber:number;
  customerId: Schema.Types.ObjectId;
  customerName: string;
  deviceInfo: string;
  issueDescription: string;
  status: RepairStatus;
  assignedTechnicianId?: string;
  technicianName?: string;
  requestDate: Date;
  completionDate?: Date;
  cost?: number;
  notes?: string;
}
const repairSchema = new Schema({
    TicketId: {
    type: String,
    required: true
  },
  
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  customerName: {
    type: String,
    required: true
  },
  deviceInfo: {
    type: String,
    required: true
  },
  issueDescription: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(RepairStatus),
    default: RepairStatus.REQUESTED
  },
  assignedTechnicianId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  technicianName: String,
  requestDate: {
    type: Date,
    default: Date.now
  },
  completionDate: Date,
  cost: Number,
  notes: String
}, {
  timestamps: true
});

export default model<IRepair>('Repair', repairSchema); 