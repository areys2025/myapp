import { Schema, model, Document } from 'mongoose';

// Define UserRole enum to match frontend
export enum UserRole {
  CUSTOMER = 'Customer',
  TECHNICIAN = 'Technician',
  MANAGER = 'Manager'
}

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  walletAddress: string;
  contactNumber?: string;
specialization: [{ type: String }],
  availability?: boolean;
  createdAt: Date;
  updatedAt: Date;
resetPasswordToken?: string;
resetPasswordExpires?: Date;

}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: {
    type:String
  },
  resetPasswordExpires: {
    type:Date
  },
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Customer', 'Technician', 'Manager']
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  // Additional fields based on role
  contactNumber: {
    type: String,
    required: false // Make optional and handle in business logic
  },

  specialization: {
  type: Array,
    required: false // Make optional and handle in business logic
  },
  availability: {
    type: Boolean,
    default: true,
    required: false // Make optional and handle in business logic
  }
}, {
  timestamps: true
});

// Add middleware to validate role-specific fields
userSchema.pre('save', function(next) {
  if (this.role === UserRole.CUSTOMER) {
    if (!this.contactNumber) {
      next(new Error('Customer requires contactNumber'));
      return;
    }
  }
  
  if (this.role === UserRole.TECHNICIAN) {
    if (!this.specialization) {
      next(new Error('Technician requires specialization'));
      return;
    }
  }
  
  next();
});



export default model<IUser>('User', userSchema); 