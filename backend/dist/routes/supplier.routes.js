"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const supplier_controller_1 = require("../controllers/supplier.controller");
const router = express_1.default.Router();
router.post('/', supplier_controller_1.createSupplier);
router.get('/', supplier_controller_1.getSuppliers);
router.get('/:id', supplier_controller_1.getSupplierById);
router.put('/:id', supplier_controller_1.updateSupplier);
router.delete('/:id', supplier_controller_1.deleteSupplier);
exports.default = router;
