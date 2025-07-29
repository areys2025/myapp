"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventoryController_1 = require("../controllers/inventoryController");
const router = express_1.default.Router();
router.post('/', inventoryController_1.createItem);
router.put('/:id', inventoryController_1.updateItem);
router.get('/', inventoryController_1.getAllItems);
router.get('/:_id', inventoryController_1.getItemById);
router.delete('/:id', inventoryController_1.deleteItem);
exports.default = router;
