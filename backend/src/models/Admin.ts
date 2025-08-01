import mongoose, { Schema, Document } from 'mongoose';
export enum UserRole {
  CUSTOMER = 'Customer',
  TECHNICIAN = 'Technician',
  MANAGER = 'Manager'
}
export interface Admin extends Document {
  name: string;
  email: string;
  // availability: { type: String, required: true },

  password: string;
  contactNumber: string;
  walletAddress: string;
  role: UserRole;
  createdAt: Date;
}

const adminSchema = new Schema<Admin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // availability: { type: String, required: true },

  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  walletAddress: { type: String, required: true },
  role: { type: String, default: UserRole.MANAGER },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<Admin>('Admin', adminSchema);
