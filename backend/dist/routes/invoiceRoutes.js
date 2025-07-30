"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const invoiceController_1 = require("../controllers/invoiceController");
const router = express_1.default.Router();
router.get('/', invoiceController_1.getAllInvoices);
router.get('/:id', invoiceController_1.getInvoiceById);
router.post('/', invoiceController_1.createInvoice);
// router.delete('/:id', deleteInvoice);
exports.default = router;
