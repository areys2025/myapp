"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePurchaseOrder = exports.getAllPurchaseOrders = exports.createPurchaseOrder = void 0;
const PurchaseOrder_1 = __importDefault(require("../models/PurchaseOrder"));
const generateItemId_1 = require("../config/generateItemId");
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
            purchInvId,
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
        const { id } = req.params;
        const { itemId, itemName, quantity, orderDate, expectedDeliveryDate, status, supplier, totalCost, } = req.body;
        const updated = await PurchaseOrder_1.default.findByIdAndUpdate(id, {
            itemId,
            itemName,
            quantity,
            orderDate,
            expectedDeliveryDate,
            status,
            supplier,
            totalCost,
        }, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ message: 'Purchase order not found.' });
        }
        res.json(updated);
    }
    catch (err) {
        console.error('Error updating purchase order:', err);
        res.status(500).json({ message: 'Failed to update purchase order.' });
    }
};
exports.updatePurchaseOrder = updatePurchaseOrder;
