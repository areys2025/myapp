"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpense = exports.getAllExpenses = void 0;
const expenseModel_1 = __importDefault(require("../models/expenseModel"));
const getNextId_1 = require("../config/getNextId");
const getAllExpenses = async (_req, res) => {
    try {
        const expenses = await expenseModel_1.default.find();
        res.json(expenses);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch invoices', error });
    }
};
exports.getAllExpenses = getAllExpenses;
const createExpense = async (req, res) => {
    const expid = await (0, getNextId_1.expId)();
    try {
        // Fetch existing expenses to calculate the new ID
        const allExpenses = await expenseModel_1.default.find();
        const newId = `${expid}`;
        const newExpense = await expenseModel_1.default.create(Object.assign(Object.assign({}, req.body), { id: newId }));
        res.status(201).json(newExpense);
    }
    catch (error) {
        console.error('Expense creation failed:', error);
        res.status(400).json({ message: 'Error creating expense request', error });
    }
};
exports.createExpense = createExpense;
