"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const repair_controller_1 = require("../controllers/repair.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/', auth_1.authenticateToken, repair_controller_1.createRepair);
router.get('/', auth_1.authenticateToken, repair_controller_1.getRepairTickets);
router.get('/:customerId', repair_controller_1.getRepairById);
router.get('/filter/technician', repair_controller_1.getRepairTicketsForTech);
router.put('/:_id', auth_1.authenticateToken, repair_controller_1.updateRepair);
router.put('/ticket/:_id', auth_1.authenticateToken, repair_controller_1.updateRepairByTicketId);
exports.default = router;
