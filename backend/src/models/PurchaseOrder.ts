import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema({
  itemId:{ type: String, required: true, unique: true },
  itemName: { type: String, required: true },
  purchInvId:{type:String,required:true},
  quantity: { type: Number, required: true },
  orderDate: { type: Date, required: true },
  expectedDeliveryDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Received', 'Cancelled'], default: 'Pending' },
  supplier: { type: String, required: true },
  totalCost: { type: Number, required: true },
});

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
