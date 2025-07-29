"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const expenseController_1 = require("../controllers/expenseController");
const router = express_1.default.Router();
router.get('/', expenseController_1.getAllExpenses);
router.post('/', expenseController_1.createExpense);
// router.get('/:id', getExpenseById);
// router.delete('/:id', deleteExpense);
exports.default = router;
