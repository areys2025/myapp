import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);
