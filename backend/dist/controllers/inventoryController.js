"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.getItemById = exports.getAllItems = exports.updateItem = exports.createItem = void 0;
const InventoryItem_1 = __importDefault(require("../models/InventoryItem"));
const getNextId_1 = require("../config/getNextId");
// Create new inventory item
const createItem = async (req, res) => {
    try {
        const ivId = await (0, getNextId_1.getNextInvId)();
        const { name, quantity, minStockLevel, price, supplier } = req.body;
        console.log("creates");
        const newItem = new InventoryItem_1.default({
            _id: ivId,
            name,
            quantity,
            minStockLevel,
            price,
            supplier,
        });
        const saved = await newItem.save();
        res.status(201).json(saved);
    }
    catch (err) {
        console.error('POST /api/inventory error:', err);
        res.status(500).json({ message: 'Failed to create inventory item.' });
    }
};
exports.createItem = createItem;
// Update item
const updateItem = async (req, res) => {
    try {
        console.log("updates");
        const updated = await InventoryItem_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Item not found.' });
        res.json(updated);
    }
    catch (err) {
        console.error('PUT /api/inventory/:id error:', err);
        res.status(500).json({ message: 'Failed to update inventory item.' });
    }
};
exports.updateItem = updateItem;
// Get all items
const getAllItems = async (_req, res) => {
    try {
        const items = await InventoryItem_1.default.find();
        res.json(items);
    }
    catch (err) {
        console.error('GET /api/inventory error:', err);
        res.status(500).json({ message: 'Failed to fetch items.' });
    }
};
exports.getAllItems = getAllItems;
// Get one item by ID
const getItemById = async (req, res) => {
    try {
        const item = await InventoryItem_1.default.findById(req.params._id);
        if (!item)
            return res.status(404).json({ message: 'Item not found.' });
        res.json(item);
    }
    catch (err) {
        console.error('GET /api/inventory/:_id error:', err);
        res.status(500).json({ message: 'Failed to fetch item.' });
    }
};
exports.getItemById = getItemById;
// Delete item
const deleteItem = async (req, res) => {
    try {
        const deleted = await InventoryItem_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ message: 'Item not found.' });
        res.json({ message: 'Item deleted.' });
    }
    catch (err) {
        console.error('DELETE /api/inventory/:id error:', err);
        res.status(500).json({ message: 'Failed to delete item.' });
    }
};
exports.deleteItem = deleteItem;
