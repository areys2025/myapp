import { Request, Response } from 'express';
import PurchaseOrder from '../models/PurchaseOrder';
import { getNextItemId } from '../config/generateItemId';
import InventoryItem from '../models/InventoryItem';
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
      purchInvId:purchInvId,
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
    const purchaseOrderId = req.params.id;
    const updates = req.body;
    const { status, purchInvId, quantity } = req.body;

    // Update the purchase order
    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      { _id: purchaseOrderId },
      updates,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Purchase order not found.' });
    }

    // If inventory update is required
    if (purchInvId && quantity && status=="Received") {
      const inventoryItem = await InventoryItem.findById(purchInvId);

      if (!inventoryItem) {
        return res.status(404).json({ message: 'Inventory item not found.' });
      }

      const orderQuantity = Number(quantity);
      const currentInventoryQuantity = Number(inventoryItem.quantity);

      const updatedQuantity = orderQuantity + currentInventoryQuantity;

      inventoryItem.quantity = updatedQuantity;

      await InventoryItem.findByIdAndUpdate(
        { _id: purchInvId },
        { quantity: updatedQuantity },
        { new: true }
      );
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating purchase order:', err);
    res.status(500).json({ message: 'Failed to update purchase order.' });
  }
};



export const getPurchaseOrderById = async (req: Request, res: Response) => {
  try {
    const _id= req.params.id;

    const purchs = await PurchaseOrder.findById(_id);

    res.status(200).json(purchs);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ message: 'Failed to fetch purchase orders' });
  }
};

