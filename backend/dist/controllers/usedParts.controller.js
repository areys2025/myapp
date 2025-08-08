"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsedPart = void 0;
const InventoryItem_1 = __importDefault(require("../models/InventoryItem")); // Your inventory model
const UsedPart_model_1 = __importDefault(require("../models/UsedPart.model"));
const getNextId_1 = require("../config/getNextId");
const getNextId_2 = require("../config/getNextId");
const createUsedPart = async (req, res) => {
    const prtId = await (0, getNextId_1.getNextPartId)();
    const wrkordId = await (0, getNextId_2.getworkOrderId)();
    try {
        const { partName, partId, quantity, workOrderId, notes } = req.body;
        // 1. Save used part record
        const usedPart = new UsedPart_model_1.default({
            _id: prtId,
            partName,
            partId,
            quantity,
            workOrderId: wrkordId,
            notes,
        });
        await usedPart.save();
        // 2. Find inventory item by partId (or name, depending on your schema)
        const inventoryItem = await InventoryItem_1.default.findOne({ _id: partId }); // or { name: partName } if you prefer
        console.log(usedPart);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to register part and update inventory' });
    }
};
exports.createUsedPart = createUsedPart;
