"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const repair_routes_1 = __importDefault(require("./routes/repair.routes"));
const log_routes_1 = __importDefault(require("./routes/log.routes"));
const invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
const app = (0, express_1.default)();
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const auth_1 = require("./middleware/auth");
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const purchaseOrder_routes_1 = __importDefault(require("./routes/purchaseOrder.routes"));
const technician_routes_1 = __importDefault(require("./routes/technician.routes"));
const user_routes_2 = __importDefault(require("./routes/user.routes"));
const user_routes_3 = __importDefault(require("./routes/user.routes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const admin_routes_2 = __importDefault(require("./routes/admin.routes"));
// import deleteAdmin  from './routes/admin.routes';
const adminControl_1 = require("./controllers/adminControl");
const user_routes_4 = __importDefault(require("./routes/user.routes"));
const usedParts_routes_1 = __importDefault(require("./routes/usedParts.routes"));
const admin_routes_3 = __importDefault(require("./routes/admin.routes"));
const supplier_routes_1 = __importDefault(require("./routes/supplier.routes"));
const feedback_routes_1 = __importDefault(require("./routes/feedback.routes"));
const expenseRoutes_1 = __importDefault(require("./routes/expenseRoutes"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 
// Database connection
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chainrepair')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
app.use('/api/suppliers', supplier_routes_1.default);
// Public routes
app.use('/api/auth', auth_routes_1.default);
// Protected routes
app.use('/api/repairs', repair_routes_1.default);
app.use('/api/system-logs', log_routes_1.default);
app.use('/api/users', auth_1.authenticateToken, user_routes_1.default);
app.use('/api/dashboard', auth_1.authenticateToken, dashboard_routes_1.default);
app.use("/api/regisadmin", auth_1.authenticateToken, admin_routes_1.default);
app.use("/api/technicians", auth_1.authenticateToken, technician_routes_1.default);
app.use("/api/getAdmins", admin_routes_2.default);
app.use('/api/regisadmin/:id', adminControl_1.updateAdmin);
app.use('/api/regisadmin', auth_1.authenticateToken, admin_routes_3.default);
app.use('/api/inventory', inventory_routes_1.default);
app.use('/api/used-parts', usedParts_routes_1.default);
app.use('/api/expenses', expenseRoutes_1.default);
app.use('/api/purchase-orders', purchaseOrder_routes_1.default);
app.use('/api/purchase-orders', purchaseOrder_routes_1.default);
app.use('/api/forgot-password', user_routes_4.default);
app.use('/api/feedback', feedback_routes_1.default);
// app.use('/api/repairs/:customerId', getRepairById)
app.use('/api/repairs', repair_routes_1.default);
app.use('/api/invoices', invoiceRoutes_1.default);
// app.use( '/api/invoices',getAllInvoices)
// app.use('/api/invoices/:id',getInvoiceById)
app.use('/api', paymentRoutes_1.default);
// app.use('/api/repairs/:TicketId', updateRepairByTicketId);
app.put("/api/users/:id", auth_1.authenticateToken, user_routes_2.default);
app.use("/api/:id/password", auth_1.authenticateToken, user_routes_3.default);
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
app.get('/', (req, res) => {
    res.send('API is working!');
});
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../dist', 'index.html'));
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
