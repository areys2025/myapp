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

// export default invoices;



import mongoose from 'mongoose';

const invoicesItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    customer: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
} );

export default mongoose.model('invoicesItem', invoicesItemSchema);

    