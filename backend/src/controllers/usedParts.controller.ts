import Inventory from '../models/InventoryItem';  // Your inventory model
import UsedPart from '../models/UsedPart.model';
import { Request, Response } from 'express';
import { getNextPartId } from '../config/getNextId';
import {getworkOrderId} from '../config/getNextId'
export const createUsedPart = async (req: Request, res: Response) => {
    const prtId=await getNextPartId()
const wrkordId=await getworkOrderId();
    try {
    const { partName, partId, quantity, workOrderId, notes } = req.body;

    // 1. Save used part record
    const usedPart = new UsedPart({
    _id:prtId,
      partName,
      partId,
      quantity,
      workOrderId:wrkordId,
      notes,
    });
    
    await usedPart.save();

    // 2. Find inventory item by partId (or name, depending on your schema)
    const inventoryItem = await Inventory.findOne({ _id: partId });  // or { name: partName } if you prefer
console.log(usedPart)
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // 3. Check if there is enough stock
    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock in inventory' });
    }

    // 4. Decrement inventory quantity
    inventoryItem.quantity -= quantity;

    // 5. Save updated inventory
    await inventoryItem.save();

    res.status(201).json({ message: 'Used part registered and inventory updated', data: usedPart });

} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register part and update inventory' });
  }
};
