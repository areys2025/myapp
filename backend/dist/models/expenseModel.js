"use strict";
// const expenses = [
//   {
//     id: 'exp-1',
//     category: 'Office Supplies',
//     amount: 200,
//     date: '2025-06-02'
//   },
//   {
//     id: 'exp-2',
//     category: 'Travel',
//     amount: 1500,
//     date: '2025-06-10'
//   }
// ];
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export default expenses;
const mongoose_1 = __importDefault(require("mongoose"));
const expenses = new mongoose_1.default.Schema({
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
});
exports.default = mongoose_1.default.model('expensesItem', expenses);
