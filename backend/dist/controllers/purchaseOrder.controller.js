"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchaseOrderById = exports.updatePurchaseOrder = exports.getAllPurchaseOrders = exports.createPurchaseOrder = void 0;
const PurchaseOrder_1 = __importDefault(require("../models/PurchaseOrder"));
const generateItemId_1 = require("../config/generateItemId");
const InventoryItem_1 = __importDefault(require("../models/InventoryItem"));
const createPurchaseOrder = async (req, res) => {
    try {
        const id = await (0, generateItemId_1.getNextItemId)();
        const { itemName, quantity, purchInvId, orderDate, expectedDeliveryDate, status, supplier, totalCost } = req.body;
        if (!itemName || !quantity || !orderDate || !expectedDeliveryDate || !supplier || !totalCost) {
            return res.status(400).json({ message: 'All required fields must be provided.' });
        }
        const order = new PurchaseOrder_1.default({
            itemId: id,
            itemName,
            quantity,
            purchInvId: purchInvId,
            orderDate,
            expectedDeliveryDate,
            status: status || 'Pending',
            supplier,
            totalCost,
        });
        const saved = await order.save();
        res.status(201).json(saved);
    }
    catch (err) {
        console.error('Error creating purchase order:', err);
        res.status(500).json({ message: 'Failed to create purchase order.' });
    }
};
exports.createPurchaseOrder = createPurchaseOrder;
const getAllPurchaseOrders = async (_req, res) => {
    try {
        const orders = await PurchaseOrder_1.default.find();
        res.json(orders);
    }
    catch (err) {
        res.status(500).json({ message: 'Error fetching purchase orders' });
    }
};
exports.getAllPurchaseOrders = getAllPurchaseOrders;
const updatePurchaseOrder = async (req, res) => {
    try {
        const purchaseOrderId = req.params.id;
        const updates = req.body;
        const { status, purchInvId, quantity } = req.body;
        // Update the purchase order
        const updatedOrder = await PurchaseOrder_1.default.findByIdAndUpdate({ _id: purchaseOrderId }, updates, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Purchase order not found.' });
        }
        // If inventory update is required
        if (purchInvId && quantity && status == "Received") {
            const inventoryItem = await InventoryItem_1.default.findById(purchInvId);
            if (!inventoryItem) {
                return res.status(404).json({ message: 'Inventory item not found.' });
            }
            const orderQuantity = Number(quantity);
            const currentInventoryQuantity = Number(inventoryItem.quantity);
            const updatedQuantity = orderQuantity + currentInventoryQuantity;
            inventoryItem.quantity = updatedQuantity;
            await InventoryItem_1.default.findByIdAndUpdate({ _id: purchInvId }, { quantity: updatedQuantity }, { new: true });
        }
        res.json(updatedOrder);
    }
    catch (err) {
        console.error('Error updating purchase order:', err);
        res.status(500).json({ message: 'Failed to update purchase order.' });
    }
};
exports.updatePurchaseOrder = updatePurchaseOrder;
const getPurchaseOrderById = async (req, res) => {
    try {
        const _id = req.params.id;
        const purchs = await PurchaseOrder_1.default.findById(_id);
        res.status(200).json(purchs);
    }
    catch (error) {
        console.error('Error fetching purchase orders:', error);
        res.status(500).json({ message: 'Failed to fetch purchase orders' });
    }
};
exports.getPurchaseOrderById = getPurchaseOrderById;
