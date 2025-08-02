"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_1 = require("../middleware/auth");
const repair_controller_1 = require("../controllers/repair.controller");
const repair_controller_2 = require("../controllers/repair.controller");
router.post('/', repair_controller_1.createRepair);
router.get('/', repair_controller_1.getRepairTickets);
router.get('/', repair_controller_1.updateRepairByTicketId);
router.post('/', auth_1.authenticateToken, repair_controller_1.createRepair);
// router.post('/', createRepair);
router.get('/', auth_1.authenticateToken, repair_controller_1.getRepairTickets);
router.put("/:_id", auth_1.authenticateToken, repair_controller_1.updateRepair); // expects a MongoDB ObjectId
// router.put('/:TicketId', updateRepairByTicketId);
router.get('/:customerId', repair_controller_1.getRepairById);
router.get('/', repair_controller_2.getRepairTicketsForTech);
exports.default = router;
