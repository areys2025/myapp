import { Request, Response } from 'express';
import PurchaseOrder from '../models/PurchaseOrder';
import { getNextItemId } from '../config/generateItemId';

export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const id = await getNextItemId();
    const { itemName, quantity,purchInvId, orderDate, expectedDeliveryDate, status, supplier, totalCost } = req.body;

    if (!itemName || !quantity || !orderDate || !expectedDeliveryDate || !supplier || !totalCost) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const order = new PurchaseOrder({
      itemId: id,
      itemName,
      quantity,
      purchInvId,
      orderDate,
      expectedDeliveryDate,
      status: status || 'Pending',
      supplier,
      totalCost,
    });

    const saved = await order.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error creating purchase order:', err);
    res.status(500).json({ message: 'Failed to create purchase order.' });
  }
};

export const getAllPurchaseOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await PurchaseOrder.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching purchase orders' });
  }
};

export const updatePurchaseOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      itemId,
      itemName,
      quantity,
      orderDate,
      expectedDeliveryDate,
      status,
      supplier,
      totalCost,
    } = req.body;

    const updated = await PurchaseOrder.findByIdAndUpdate(
      id,
      {
        itemId,
        itemName,
        quantity,
        orderDate,
        expectedDeliveryDate,
        status,
        supplier,
        totalCost,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Purchase order not found.' });
    }

    res.json(updated);
  } catch (err) {
    console.error('Error updating purchase order:', err);
    res.status(500).json({ message: 'Failed to update purchase order.' });
  }
};
