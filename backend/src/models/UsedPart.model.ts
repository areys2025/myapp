import mongoose, { Schema, Document } from 'mongoose';

export interface IUsedPart extends Document {
  _id: String, // custom ID, e.g. SKU or part number
  partName: string;
  partId: string;
  quantity: number;
  workOrderId?: string;
  notes?: string;
  createdAt: Date;
}

const UsedPartSchema: Schema = new Schema({
  _id: { type: String, required: true }, 
  partName: { type: String, required: true },
  partId: { type: String, required: true },
  quantity: { type: Number, required: true },
  workOrderId: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const UsedPart = mongoose.model<IUsedPart>('UsedPart', UsedPartSchema);

export default UsedPart;
