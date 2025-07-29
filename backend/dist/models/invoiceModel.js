"use strict";
// const invoices = [
//   {
//     id: 'inv-1',
//     customer: 'Acme Corp',
//     amount: 1200,
//     date: '2025-06-01'
//   },
//   {
//     id: 'inv-2',
//     customer: 'Globex Inc',
//     amount: 950,
//     date: '2025-06-05'
//   }
// ];
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// export default invoices;
const mongoose_1 = __importDefault(require("mongoose"));
const invoicesItemSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    customer: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
});
exports.default = mongoose_1.default.model('invoicesItem', invoicesItemSchema);
