import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import repairRoutes from './routes/repair.routes';
import logRoutes from './routes/log.routes';
import invoiceRoutes from './routes/invoiceRoutes'
const app = express();

import userRoutes from './routes/user.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { authenticateToken } from './middleware/auth';
import inventoryRoutes from './routes/inventory.routes';

import getAllInvoices from './routes/invoiceRoutes'
import getInvoiceById from './routes/expenseRoutes'
import purchaseOrderRoutes from './routes/purchaseOrder.routes';

import technicianRoutes from './routes/technician.routes'
import createInvoice from './routes/invoiceRoutes'
import getRepairById from './routes/repair.routes'
import updateRepairByTicketId from './routes/repair.routes'
import updateUserProfile from './routes/user.routes';
import changeUserPassword  from './routes/user.routes';
import paymentRoutes from './routes/paymentRoutes';

import registerAdmin from './routes/admin.routes';
import getAllAdmins  from './routes/admin.routes';
// import deleteAdmin  from './routes/admin.routes';

import {updateAdmin} from './controllers/adminControl';
import forgotPassword from './routes/user.routes';
import usedPartsRoutes from './routes/usedParts.routes';
import adminRoutes from './routes/admin.routes';
import techRoutes from './routes/technician.routes';
import supplierRoutes from './routes/supplier.routes';


import feedbackroutes from './routes/feedback.routes';
import expenseRoutes from './routes/expenseRoutes';
dotenv.config();


import path from 'path';

// Middleware
app.use(cors());
app.use(express.json());
// 
// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://chaindbs:ibraahim976.@cluster0.xkhmo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/suppliers', supplierRoutes); 

// Public routes
app.use('/api/auth', authRoutes);
// Protected routes

app.use('/api/repairs',  repairRoutes);
app.use('/api/system-logs', logRoutes);

app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use("/api/regisadmin",authenticateToken,registerAdmin)
app.use("/api/technicians",authenticateToken,technicianRoutes)

app.use("/api/getAdmins",getAllAdmins)
app.use('/api/regisadmin/:id', updateAdmin);
app.use('/api/regisadmin', authenticateToken, adminRoutes);

app.use('/api/inventory', inventoryRoutes);
app.use('/api/used-parts', usedPartsRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);



app.use('/api/forgot-password', forgotPassword);
app.use('/api/feedback', feedbackroutes);


app.use('/api/repairs/:customerId', getRepairById)
app.use('/api/repairs', repairRoutes);

app.use('/api/invoices',invoiceRoutes)
app.use( '/api/invoices',getAllInvoices)
app.use('/api/invoices/:id',getInvoiceById)
app.use('/api', paymentRoutes);
app.use('/api/repairs/:TicketId', updateRepairByTicketId);
app.put("/api/users/:id", authenticateToken, updateUserProfile);
app.use("/api/:id/password",authenticateToken,changeUserPassword)


app.use(express.static(path.join(__dirname, '../dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app; 