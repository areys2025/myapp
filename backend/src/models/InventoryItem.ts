import mongoose from 'mongoose';

const InventoryItemSchema = new mongoose.Schema({
  _id: { type: String, required: true }, 
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    minStockLevel: { type: Number, required: true },
    price: { type: Number, required: true },
    supplier: { type: String, default: '' }
}, { timestamps: true });
  
  export default mongoose.model('InventoryItem', InventoryItemSchema);

    