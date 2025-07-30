"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const purchaseOrder_controller_1 = require("../controllers/purchaseOrder.controller");
const router = express_1.default.Router();
router.post('/', purchaseOrder_controller_1.createPurchaseOrder);
router.get('/', purchaseOrder_controller_1.getAllPurchaseOrders);
router.put('/:id', purchaseOrder_controller_1.updatePurchaseOrder);
exports.default = router;
