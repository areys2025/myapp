import { Request, Response } from 'express';
import InventoryItem from '../models/InventoryItem';
import { getNextInvId } from '../config/getNextId';

// Create new inventory item
export const createItem = async (req: Request, res: Response) => {
  try {
    const ivId = await getNextInvId();
    const { name, quantity, minStockLevel, price, supplier } = req.body;
console.log("creates")

    const newItem = new InventoryItem({
      _id: ivId,
      name,
      quantity,
      minStockLevel,
      price,
      supplier,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('POST /api/inventory error:', err);
    res.status(500).json({ message: 'Failed to create inventory item.' });
  }

};

// Update item
export const updateItem = async (req: Request, res: Response) => {
  try {
console.log("updates")
    const updated = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Item not found.' });
    res.json(updated);
  } catch (err) {
    console.error('PUT /api/inventory/:id error:', err);
    res.status(500).json({ message: 'Failed to update inventory item.' });
  }
};

// Get all items
export const getAllItems = async (_req: Request, res: Response) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    console.error('GET /api/inventory error:', err);
    res.status(500).json({ message: 'Failed to fetch items.' });
  }
};

// Get one item by ID
export const getItemById = async (req: Request, res: Response) => {
  try {
    const item = await InventoryItem.findById(req.params._id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (err) {
    console.error('GET /api/inventory/:_id error:', err);
    res.status(500).json({ message: 'Failed to fetch item.' });
  }
};

// Delete item
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const deleted = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    console.error('DELETE /api/inventory/:id error:', err);
    res.status(500).json({ message: 'Failed to delete item.' });
  }
};
