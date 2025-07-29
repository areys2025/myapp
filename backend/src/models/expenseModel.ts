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

// export default expenses;


import mongoose from 'mongoose';

const expenses = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
} );

export default mongoose.model('expensesItem', expenses);
